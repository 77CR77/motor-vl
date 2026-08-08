// ===== МОТОР-ВЛ: логика админ-панели =====
// Общается с /.netlify/functions/motors, которая читает и пишет
// data/motors.json прямо в GitHub-репозитории сайта.

(function () {
  "use strict";

  var API_URL = "/.netlify/functions/motors";
  var SESSION_KEY = "motorvl_admin_password";

  var loginScreen = document.getElementById("loginScreen");
  var adminApp = document.getElementById("adminApp");
  var passwordInput = document.getElementById("passwordInput");
  var loginBtn = document.getElementById("loginBtn");
  var loginError = document.getElementById("loginError");
  var logoutBtn = document.getElementById("logoutBtn");

  var listView = document.getElementById("listView");
  var formView = document.getElementById("formView");
  var motorList = document.getElementById("motorList");
  var motorCount = document.getElementById("motorCount");
  var statusMsg = document.getElementById("statusMsg");
  var newMotorBtn = document.getElementById("newMotorBtn");
  var backBtn = document.getElementById("backBtn");
  var formTitle = document.getElementById("formTitle");
  var motorForm = document.getElementById("motorForm");
  var deleteBtn = document.getElementById("deleteBtn");

  var fId = document.getElementById("fId");
  var fBrand = document.getElementById("fBrand");
  var fTitle = document.getElementById("fTitle");
  var fPrice = document.getElementById("fPrice");
  var fBadge = document.getElementById("fBadge");

  var photoDrop = document.getElementById("photoDrop");
  var photoInput = document.getElementById("photoInput");
  var photoListEl = document.getElementById("photoList");
  var videoListEl = document.getElementById("videoList");
  var specListEl = document.getElementById("specList");
  var addVideoBtn = document.getElementById("addVideoBtn");
  var addSpecBtn = document.getElementById("addSpecBtn");

  var currentMotors = [];
  var photoState = [];   // [{type:'existing'|'new', url|dataBase64, filename, isMain}]
  var videoState = [];   // [{label, url}]
  var specState = [];    // [[key, value]]

  function password() {
    return sessionStorage.getItem(SESSION_KEY) || "";
  }

  function formatPrice(n) {
    return Number(n || 0).toLocaleString("ru-RU") + " ₽";
  }

  // Старые фото — полные внешние ссылки (https://...), новые — относительные
  // пути внутри сайта (media/motors/...). Админка лежит в подпапке /admin,
  // поэтому относительным путям нужно "../" впереди, а внешним — нет.
  function resolveUrl(url) {
    if (!url) return "";
    return /^https?:\/\//.test(url) ? url : "../" + url;
  }

  // ---------- Вход ----------
  function tryLogin(pass) {
    loginError.textContent = "";
    return fetch(API_URL, { headers: { "x-admin-password": pass } })
      .then(function (res) {
        if (res.status === 401) throw new Error("Неверный пароль");
        if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Ошибка сервера"); });
        return res.json();
      })
      .then(function (data) {
        sessionStorage.setItem(SESSION_KEY, pass);
        currentMotors = data.motors || [];
        showApp();
      })
      .catch(function (err) {
        loginError.textContent = err.message;
      });
  }

  loginBtn.addEventListener("click", function () {
    var pass = passwordInput.value;
    if (!pass) return;
    loginBtn.disabled = true;
    tryLogin(pass).then(function () { loginBtn.disabled = false; });
  });
  passwordInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") loginBtn.click();
  });

  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  function showApp() {
    loginScreen.style.display = "none";
    adminApp.style.display = "block";
    renderList();
  }

  // Автовход, если пароль уже сохранён в этой вкладке браузера
  if (password()) {
    tryLogin(password());
  }

  // ---------- Список моторов ----------
  function renderList() {
    formView.style.display = "none";
    listView.style.display = "block";
    motorCount.textContent = "Всего моторов: " + currentMotors.length;
    motorList.innerHTML = currentMotors.map(function (m) {
      return (
        '<div class="admin-list__item">' +
          '<img class="admin-list__thumb" src="' + resolveUrl(m.img) + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
          '<div class="admin-list__body">' +
            '<div class="admin-list__title">' + m.title + "</div>" +
            '<div class="admin-list__meta">' + (m.brandLabel || m.brand) + " · " + formatPrice(m.price) + "</div>" +
          "</div>" +
          '<button class="admin-list__edit" data-id="' + m.id + '">Изменить</button>' +
        "</div>"
      );
    }).join("") || '<p style="color:var(--text-muted);">Моторов пока нет — добавьте первый.</p>';

    motorList.querySelectorAll(".admin-list__edit").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var motor = currentMotors.find(function (m) { return m.id === btn.getAttribute("data-id"); });
        openForm(motor);
      });
    });
  }

  function showStatus(text, isError) {
    statusMsg.textContent = text;
    statusMsg.className = "admin-status " + (isError ? "admin-status--error" : "admin-status--ok");
    setTimeout(function () { statusMsg.textContent = ""; }, 4000);
  }

  // ---------- Форма ----------
  newMotorBtn.addEventListener("click", function () { openForm(null); });
  backBtn.addEventListener("click", renderList);

  function openForm(motor) {
    motorForm.reset();
    fId.value = motor ? motor.id : "";
    fBrand.value = motor ? motor.brand : "yamaha";
    fTitle.value = motor ? motor.title : "";
    fPrice.value = motor ? motor.price : "";
    fBadge.value = motor && motor.badge ? motor.badge : "";
    formTitle.textContent = motor ? "Редактирование мотора" : "Новый мотор";
    deleteBtn.style.display = motor ? "inline-block" : "none";

    photoState = motor && motor.photos ? motor.photos.map(function (url) {
      return { type: "existing", url: url, isMain: url === motor.img };
    }) : [];
    videoState = motor && motor.videos ? motor.videos.map(function (v) {
      return typeof v === "string" ? { label: v, url: "" } : { label: v.label || "", url: v.url || "" };
    }) : [];
    specState = motor && motor.specs ? motor.specs.map(function (s) { return [s[0], s[1]]; }) : [];

    renderPhotos();
    renderVideos();
    renderSpecs();

    listView.style.display = "none";
    formView.style.display = "block";
    window.scrollTo(0, 0);
  }

  // ---------- Фото ----------
  photoDrop.addEventListener("click", function () { photoInput.click(); });
  photoDrop.addEventListener("dragover", function (e) { e.preventDefault(); photoDrop.classList.add("dragover"); });
  photoDrop.addEventListener("dragleave", function () { photoDrop.classList.remove("dragover"); });
  photoDrop.addEventListener("drop", function (e) {
    e.preventDefault();
    photoDrop.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });
  photoInput.addEventListener("change", function () {
    handleFiles(photoInput.files);
    photoInput.value = "";
  });

  function handleFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (file) {
      if (!/^image\//.test(file.type)) return;
      var reader = new FileReader();
      reader.onload = function () {
        var base64 = reader.result.split(",")[1];
        photoState.push({
          type: "new",
          filename: file.name,
          dataBase64: base64,
          previewUrl: reader.result,
          isMain: photoState.length === 0
        });
        renderPhotos();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPhotos() {
    photoListEl.innerHTML = photoState.map(function (p, i) {
      var src = p.type === "new" ? p.previewUrl : resolveUrl(p.url);
      return (
        '<div class="admin-photo-item' + (p.isMain ? " is-main" : "") + '" data-i="' + i + '">' +
          '<img src="' + src + '" alt="">' +
          '<button type="button" class="admin-photo-item__star" data-i="' + i + '" title="Сделать главной">★</button>' +
          '<button type="button" class="admin-photo-item__remove" data-i="' + i + '" title="Удалить">✕</button>' +
        "</div>"
      );
    }).join("");

    photoListEl.querySelectorAll(".admin-photo-item__star").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        photoState.forEach(function (p, j) { p.isMain = (j === i); });
        renderPhotos();
      });
    });
    photoListEl.querySelectorAll(".admin-photo-item__remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        var wasMain = photoState[i].isMain;
        photoState.splice(i, 1);
        if (wasMain && photoState.length) photoState[0].isMain = true;
        renderPhotos();
      });
    });
  }

  // ---------- Видео ----------
  addVideoBtn.addEventListener("click", function () {
    videoState.push({ label: "", url: "" });
    renderVideos();
  });

  function renderVideos() {
    videoListEl.innerHTML = videoState.map(function (v, i) {
      return (
        '<div class="admin-video-row" data-i="' + i + '">' +
          '<input type="text" class="form-control video-label" placeholder="Название, напр. «Запуск двигателя»" value="' + escapeAttr(v.label) + '">' +
          '<input type="text" class="form-control video-url" placeholder="Ссылка на YouTube/VK Видео (необязательно)" value="' + escapeAttr(v.url) + '">' +
          '<button type="button" class="admin-row-remove" data-i="' + i + '">✕</button>' +
        "</div>"
      );
    }).join("");

    videoListEl.querySelectorAll(".admin-video-row").forEach(function (row) {
      var i = parseInt(row.getAttribute("data-i"), 10);
      row.querySelector(".video-label").addEventListener("input", function (e) { videoState[i].label = e.target.value; });
      row.querySelector(".video-url").addEventListener("input", function (e) { videoState[i].url = e.target.value; });
    });
    videoListEl.querySelectorAll(".admin-row-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        videoState.splice(parseInt(btn.getAttribute("data-i"), 10), 1);
        renderVideos();
      });
    });
  }

  // ---------- Характеристики ----------
  addSpecBtn.addEventListener("click", function () {
    specState.push(["", ""]);
    renderSpecs();
  });

  function renderSpecs() {
    specListEl.innerHTML = specState.map(function (s, i) {
      return (
        '<div class="admin-spec-row" data-i="' + i + '">' +
          '<input type="text" class="form-control spec-key" placeholder="Характеристика, напр. «Год»" value="' + escapeAttr(s[0]) + '">' +
          '<input type="text" class="form-control spec-val" placeholder="Значение, напр. «2019»" value="' + escapeAttr(s[1]) + '">' +
          '<button type="button" class="admin-row-remove" data-i="' + i + '">✕</button>' +
        "</div>"
      );
    }).join("");

    specListEl.querySelectorAll(".admin-spec-row").forEach(function (row) {
      var i = parseInt(row.getAttribute("data-i"), 10);
      row.querySelector(".spec-key").addEventListener("input", function (e) { specState[i][0] = e.target.value; });
      row.querySelector(".spec-val").addEventListener("input", function (e) { specState[i][1] = e.target.value; });
    });
    specListEl.querySelectorAll(".admin-row-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        specState.splice(parseInt(btn.getAttribute("data-i"), 10), 1);
        renderSpecs();
      });
    });
  }

  function escapeAttr(str) {
    return String(str == null ? "" : str).replace(/"/g, "&quot;");
  }

  // ---------- Сохранение ----------
  motorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var submitBtn = motorForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Сохраняем…";

    var motor = {
      id: fId.value || null,
      brand: fBrand.value,
      title: fTitle.value.trim(),
      price: fPrice.value,
      badge: fBadge.value.trim(),
      photos: photoState.map(function (p) {
        return p.type === "new"
          ? { type: "new", filename: p.filename, dataBase64: p.dataBase64, isMain: !!p.isMain }
          : { type: "existing", url: p.url, isMain: !!p.isMain };
      }),
      videos: videoState.filter(function (v) { return v.label.trim(); }),
      specs: specState.filter(function (s) { return s[0].trim(); })
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password(), action: "save", motor: motor })
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Ошибка сохранения"); });
        return res.json();
      })
      .then(function (data) {
        currentMotors = data.motors || [];
        renderList();
        showStatus("Сохранено: " + (data.saved ? data.saved.title : motor.title));
      })
      .catch(function (err) {
        showStatus(err.message, true);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Сохранить";
      });
  });

  // ---------- Удаление ----------
  deleteBtn.addEventListener("click", function () {
    if (!fId.value) return;
    if (!confirm("Удалить этот мотор? Действие нельзя отменить.")) return;

    deleteBtn.disabled = true;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password(), action: "delete", id: fId.value })
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || "Ошибка удаления"); });
        return res.json();
      })
      .then(function (data) {
        currentMotors = data.motors || [];
        renderList();
        showStatus("Мотор удалён");
      })
      .catch(function (err) {
        showStatus(err.message, true);
      })
      .finally(function () {
        deleteBtn.disabled = false;
      });
  });
})();
