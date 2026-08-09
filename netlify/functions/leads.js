// ===== МОТОР-ВЛ: заявки с формы "Оставить заявку" =====
//
// В отличие от каталога моторов, заявки хранятся НЕ в GitHub-репозитории —
// репозиторий сайта публичный (его показывают приёмной комиссии), а в заявках
// настоящие имена, телефоны и e-mail клиентов. Поэтому используется приватное
// хранилище Netlify Blobs, доступное только этому сайту и никому больше.
//
// Требуемая переменная окружения: ADMIN_PASSWORD (та же, что и для /admin).
// Ничего дополнительно настраивать не нужно — Netlify Blobs работает "из коробки".

const { getStore } = require("@netlify/blobs");

function jsonResponse(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  };
}

function checkPassword(password) {
  return typeof password === "string" && password.length > 0 && password === process.env.ADMIN_PASSWORD;
}

function store() {
  return getStore("leads");
}

async function readLeads() {
  const s = store();
  const data = await s.get("all", { type: "json" });
  return Array.isArray(data) ? data : [];
}

async function writeLeads(leads) {
  await store().setJSON("all", leads);
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");

      // Публичное действие — отправка заявки с сайта, пароль не нужен
      if (payload.action === "submit") {
        const name = (payload.name || "").trim();
        const phone = (payload.phone || "").trim();
        if (!name || !phone) return jsonResponse(400, { error: "Не заполнены обязательные поля" });

        const leads = await readLeads();
        const lead = {
          id: "l" + Date.now() + Math.floor(Math.random() * 1000),
          name: name,
          phone: phone,
          email: (payload.email || "").trim(),
          motor: (payload.motor || "").trim(),
          message: (payload.message || "").trim(),
          createdAt: new Date().toISOString(),
          viewed: false
        };
        leads.unshift(lead);
        await writeLeads(leads);
        return jsonResponse(200, { ok: true });
      }

      // Остальные действия — только для администратора
      if (!checkPassword(payload.password)) return jsonResponse(401, { error: "Неверный пароль" });

      const leads = await readLeads();

      if (payload.action === "markViewed") {
        const lead = leads.find(function (l) { return l.id === payload.id; });
        if (!lead) return jsonResponse(404, { error: "Заявка не найдена" });
        lead.viewed = !!payload.viewed;
        await writeLeads(leads);
        return jsonResponse(200, { leads: leads });
      }

      if (payload.action === "delete") {
        const idx = leads.findIndex(function (l) { return l.id === payload.id; });
        if (idx === -1) return jsonResponse(404, { error: "Заявка не найдена" });
        leads.splice(idx, 1);
        await writeLeads(leads);
        return jsonResponse(200, { leads: leads });
      }

      return jsonResponse(400, { error: "Неизвестное действие" });
    }

    if (event.httpMethod === "GET") {
      const password = event.headers["x-admin-password"] || event.headers["X-Admin-Password"];
      if (!checkPassword(password)) return jsonResponse(401, { error: "Неверный пароль" });
      const leads = await readLeads();
      return jsonResponse(200, { leads: leads });
    }

    return jsonResponse(405, { error: "Метод не поддерживается" });
  } catch (err) {
    return jsonResponse(500, { error: String((err && err.message) || err) });
  }
};
