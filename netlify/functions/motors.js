// ===== МОТОР-ВЛ: серверная функция админ-панели =====
//
// Обслуживает /admin — принимает пароль, читает и меняет data/motors.json
// (список моторов) прямо в GitHub-репозитории через GitHub REST API, а также
// загружает новые фотографии в media/motors/<id>/. После каждого изменения
// Netlify автоматически пересобирает и публикует сайт (если сайт подключён
// к GitHub как Git-репозиторий, а не залит вручную через Netlify Drop).
//
// Требуемые переменные окружения (Site settings → Environment variables в Netlify):
//   ADMIN_PASSWORD   — пароль администратора
//   GITHUB_TOKEN     — Personal Access Token с правом "repo" на нужный репозиторий
//   GITHUB_REPO      — например "77CR77/motor-vl"
//   GITHUB_BRANCH    — например "main" (необязательно, по умолчанию "main")

const GITHUB_API = "https://api.github.com";
// Пути указаны от корня GitHub-репозитория (там же, где лежат index.html, css/, js/).
const DATA_PATH = "data/motors.json";
const MEDIA_DIR = "media/motors";

const BRAND_LABELS = {
  yamaha: "Yamaha",
  honda: "Honda",
  suzuki: "Suzuki",
  tohatsu: "Tohatsu / Mercury",
  parts: "Запчасти"
};

function jsonResponse(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  };
}

function githubHeaders() {
  return {
    Authorization: "Bearer " + process.env.GITHUB_TOKEN,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json"
  };
}

function repoInfo() {
  return {
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || "main"
  };
}

async function getFile(path) {
  const { repo, branch } = repoInfo();
  const url = GITHUB_API + "/repos/" + repo + "/contents/" + path + "?ref=" + branch;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("GitHub read failed (" + path + "): " + res.status + " " + (await res.text()));
  const data = await res.json();
  return {
    sha: data.sha,
    content: Buffer.from(data.content, "base64").toString("utf8")
  };
}

async function putFile(path, contentStr, message, sha) {
  const { repo, branch } = repoInfo();
  const url = GITHUB_API + "/repos/" + repo + "/contents/" + path;
  const body = {
    message: message,
    content: Buffer.from(contentStr, "utf8").toString("base64"),
    branch: branch
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, { method: "PUT", headers: githubHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error("GitHub write failed (" + path + "): " + res.status + " " + (await res.text()));
  return res.json();
}

async function putBinaryFile(path, base64Content, message) {
  const { repo, branch } = repoInfo();
  const url = GITHUB_API + "/repos/" + repo + "/contents/" + path;
  const body = { message: message, content: base64Content, branch: branch };
  const res = await fetch(url, { method: "PUT", headers: githubHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error("GitHub upload failed (" + path + "): " + res.status + " " + (await res.text()));
  return res.json();
}

async function deleteFile(path, message, sha) {
  const { repo, branch } = repoInfo();
  const url = GITHUB_API + "/repos/" + repo + "/contents/" + path;
  const body = { message: message, sha: sha, branch: branch };
  const res = await fetch(url, { method: "DELETE", headers: githubHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error("GitHub delete failed (" + path + "): " + res.status + " " + (await res.text()));
}

async function listDir(path) {
  const { repo, branch } = repoInfo();
  const url = GITHUB_API + "/repos/" + repo + "/contents/" + path + "?ref=" + branch;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) return [];
  if (!res.ok) return [];
  return res.json();
}

function checkPassword(password) {
  return typeof password === "string" && password.length > 0 && password === process.env.ADMIN_PASSWORD;
}

exports.handler = async function (event) {
  try {
    if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
      return jsonResponse(500, { error: "Сервер не настроен: не заданы переменные окружения ADMIN_PASSWORD / GITHUB_TOKEN / GITHUB_REPO." });
    }

    if (event.httpMethod === "GET") {
      const password = event.headers["x-admin-password"] || event.headers["X-Admin-Password"];
      if (!checkPassword(password)) return jsonResponse(401, { error: "Неверный пароль" });

      const file = await getFile(DATA_PATH);
      const motors = file ? JSON.parse(file.content) : [];
      return jsonResponse(200, { motors: motors });
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      if (!checkPassword(payload.password)) return jsonResponse(401, { error: "Неверный пароль" });

      const file = await getFile(DATA_PATH);
      const motors = file ? JSON.parse(file.content) : [];

      if (payload.action === "delete") {
        const id = payload.id;
        const idx = motors.findIndex(function (m) { return m.id === id; });
        if (idx === -1) return jsonResponse(404, { error: "Мотор не найден" });
        const removed = motors.splice(idx, 1)[0];

        await putFile(DATA_PATH, JSON.stringify(motors, null, 2), "Admin: delete \"" + removed.title + "\"", file.sha);

        // Best-effort: удаляем папку с фото этого мотора, если она есть
        try {
          const dirPath = MEDIA_DIR + "/" + id;
          const entries = await listDir(dirPath);
          for (const entry of entries) {
            await deleteFile(dirPath + "/" + entry.name, "Admin: remove media for deleted motor " + id, entry.sha);
          }
        } catch (e) { /* не критично, продолжаем */ }

        return jsonResponse(200, { motors: motors });
      }

      if (payload.action === "save") {
        const input = payload.motor || {};
        const isNew = !input.id;
        const id = input.id || ("m" + Date.now());

        // Загружаем новые фото (пришли как base64) в репозиторий,
        // существующие (уже опубликованные) оставляем как есть.
        const finalPhotoUrls = [];
        let mainUrl = "";
        const photosInput = Array.isArray(input.photos) ? input.photos : [];
        let seq = 1;
        for (const p of photosInput) {
          let url;
          if (p.type === "new") {
            const ext = (p.filename && p.filename.includes(".")) ? p.filename.split(".").pop() : "jpg";
            const path = MEDIA_DIR + "/" + id + "/photo" + seq + "." + ext;
            seq++;
            await putBinaryFile(path, p.dataBase64, "Admin: upload photo for \"" + input.title + "\"");
            url = "media/motors/" + id + "/photo" + (seq - 1) + "." + ext;
          } else {
            url = p.url;
          }
          finalPhotoUrls.push(url);
          if (p.isMain) mainUrl = url;
        }
        if (!mainUrl && finalPhotoUrls.length) mainUrl = finalPhotoUrls[0];

        const motorRecord = {
          id: id,
          brand: input.brand,
          brandLabel: BRAND_LABELS[input.brand] || input.brand,
          title: input.title,
          price: Number(input.price) || 0,
          img: mainUrl,
          photos: finalPhotoUrls,
          videos: Array.isArray(input.videos) ? input.videos : [],
          specs: Array.isArray(input.specs) ? input.specs : []
        };
        if (input.badge) motorRecord.badge = input.badge;

        const idx = motors.findIndex(function (m) { return m.id === id; });
        if (idx === -1) {
          motors.push(motorRecord);
        } else {
          motors[idx] = motorRecord;
        }

        const commitMsg = (isNew ? "Admin: add \"" : "Admin: update \"") + motorRecord.title + "\"";
        await putFile(DATA_PATH, JSON.stringify(motors, null, 2), commitMsg, file ? file.sha : undefined);

        return jsonResponse(200, { motors: motors, saved: motorRecord });
      }

      return jsonResponse(400, { error: "Неизвестное действие" });
    }

    return jsonResponse(405, { error: "Метод не поддерживается" });
  } catch (err) {
    return jsonResponse(500, { error: String((err && err.message) || err) });
  }
};
