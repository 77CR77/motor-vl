// ===== МОТОР-ВЛ: логика админ-панели =====
// Общается с /api/motors.php и /api/lead.php на своём хостинге:
// каталог и заявки лежат файлами на сервере.

(function () {
  "use strict";

  var API_URL = "/api/motors.php";
  var LEADS_URL = "/api/lead.php";
  var SESSION_KEY = "motorvl_admin_password";

  var loginScreen = document.getElementById("loginScreen");
  var adminApp = document.getElementById("adminApp");
  var passwordInput = document.getElementById("passwordInput");
  var loginBtn = document.getElementById("loginBtn");
  var loginError = document.getElementById("loginError");
  var logoutBtn = document.getElementById("logoutBtn");

  var tabMotors = document.getElementById("tabMotors");
  var tabLeads = document.getElementById("tabLeads");
  var leadsBadge = document.getElementById("leadsBadge");
  var leadsView = document.getElementById("leadsView");
  var leadsList = document.getElementById("leadsList");
  var leadsCount = document.getElementById("leadsCount");
  var leadsStatusMsg = document.getElementById("leadsStatusMsg");

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
  var currentLeads = [];
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
    loadLeads();
  }

  // Автовход, если пароль уже сохранён в этой вкладке браузера
  if (password()) {
    tryLogin(password());
  }

  // ---------- Переключение вкладок ----------
  tabMotors.addEventListener("click", function () {
    tabMotors.classList.add("active");
    tabLeads.classList.remove("active");
    leadsView.style.display = "none";
    renderList();
  });
  tabLeads.addEventListener("click", function () {
    tabLeads.classList.add("active");
    tabMotors.classList.remove("active");
    listView.style.display = "none";
    formView.style.display = "none";
    leadsView.style.display = "block";
    renderLeads();
  });

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

  // ---------- Заявки ----------
  function loadLeads() {
    fetch(LEADS_URL, { headers: { "x-admin-password": password() } })
      .then(function (res) { return res.ok ? res.json() : { leads: [] }; })
      .then(function (data) {
        currentLeads = data.leads || [];
        updateLeadsBadge();
        if (leadsView.style.display !== "none") renderLeads();
      })
      .catch(function () {});
  }

  function updateLeadsBadge() {
    var unread = currentLeads.filter(function (l) { return !l.viewed; }).length;
    if (unread > 0) {
      leadsBadge.textContent = unread;
      leadsBadge.style.display = "inline-block";
    } else {
      leadsBadge.style.display = "none";
    }
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) { return ""; }
  }

  function showLeadsStatus(text, isError) {
    leadsStatusMsg.textContent = text;
    leadsStatusMsg.className = "admin-status " + (isError ? "admin-status--error" : "admin-status--ok");
    setTimeout(function () { leadsStatusMsg.textContent = ""; }, 4000);
  }

  function renderLeads() {
    leadsCount.textContent = "Всего заявок: " + currentLeads.length;
  // В поле motor лежит строка вида «<конкретный мотор> · <параметры подбора>».
  // Параметры уже показаны таблицей, поэтому из строки достаём только ту часть,
  // где клиент назвал конкретную модель, — иначе одно и то же выводилось бы дважды.
  function exactMotorOf(lead) {
    var motor = (lead.motor || "").trim();
    if (!motor) return "";
    var spec = lead.spec || {};
    var keys = Object.keys(spec);
    if (!keys.length) return motor;
    var specLine = keys.map(function (key) {
      var value = spec[key];
      return key + ": " + (Array.isArray(value) ? value.join(", ") : value);
    }).join(" · ");
    if (motor === specLine) return "";
    return motor.replace(" · " + specLine, "").replace(specLine, "").trim();
  }

    leadsList.innerHTML = currentLeads.map(function (l) {
      return (
        '<div class="admin-lead' + (l.viewed ? "" : " is-new") + '" data-id="' + l.id + '">' +
          '<div class="admin-lead__top">' +
            '<div><span class="admin-lead__name">' + l.name + "</span>" +
              (l.viewed ? "" : '<span class="admin-lead__new-tag">новая</span>') +
            "</div>" +
            '<div class="admin-lead__date">' + formatDate(l.createdAt) + "</div>" +
          "</div>" +
          '<div class="admin-lead__row">📞 <a href="tel:' + l.phone + '">' + l.phone + "</a></div>" +
          (l.messengers && l.messengers.length
            ? '<div class="admin-lead__row">💬 ' + l.messengers.join(", ") + "</div>"
            : "") +
          (l.email ? '<div class="admin-lead__row">✉️ <a href="mailto:' + l.email + '">' + l.email + "</a></div>" : "") +
          (exactMotorOf(l) ? '<div class="admin-lead__row">🛥️ ' + exactMotorOf(l) + "</div>" : "") +
          (l.spec && Object.keys(l.spec).length
            ? '<div class="admin-lead__spec">' +
                Object.keys(l.spec).map(function (key) {
                  var value = l.spec[key];
                  return '<div class="admin-lead__spec-row"><em>' + key + "</em><b>" +
                    (Array.isArray(value) ? value.join(", ") : value) + "</b></div>";
                }).join("") +
              "</div>"
            : "") +
          (l.message ? '<div class="admin-lead__message">' + l.message + "</div>" : "") +
          '<div class="admin-lead__actions">' +
            '<button class="admin-lead__btn admin-lead__btn--toggle" data-id="' + l.id + '" data-viewed="' + (!l.viewed) + '">' +
              (l.viewed ? "Отметить непросмотренной" : "Отметить просмотренной") +
            "</button>" +
            '<button class="admin-lead__btn admin-lead__btn--delete" data-id="' + l.id + '">Удалить</button>' +
          "</div>" +
        "</div>"
      );
    }).join("") || '<p style="color:var(--text-muted);">Заявок пока нет.</p>';

    leadsList.querySelectorAll(".admin-lead__btn--toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var viewed = btn.getAttribute("data-viewed") === "true";
        fetch(LEADS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password(), action: "markViewed", id: id, viewed: viewed })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            currentLeads = data.leads || currentLeads;
            updateLeadsBadge();
            renderLeads();
          })
          .catch(function () { showLeadsStatus("Ошибка обновления", true); });
      });
    });

    leadsList.querySelectorAll(".admin-lead__btn--delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!confirm("Удалить эту заявку?")) return;
        var id = btn.getAttribute("data-id");
        fetch(LEADS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password(), action: "delete", id: id })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            currentLeads = data.leads || currentLeads;
            updateLeadsBadge();
            renderLeads();
            showLeadsStatus("Заявка удалена");
          })
          .catch(function () { showLeadsStatus("Ошибка удаления", true); });
      });
    });
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
    loadSpecs(motor && motor.specs ? motor.specs.map(function (s) { return [s[0], s[1]]; }) : []);

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
  // Шаблон из 11 пунктов — одинаковый для всех моторов и всегда в этом порядке.
  // Где вариантов немного, они выбираются из списка; «Другое…» открывает поле ввода,
  // так что вписать нестандартное значение по-прежнему можно.
  // Тот же порядок используется на сайте — см. tools/normalize_specs.py.
  var SPEC_TEMPLATE = [
    { label: "Год", placeholder: "напр. 2019" },
    { label: "Состояние", options: ["новый", "б/у"] },
    { label: "Тактность", options: ["4-тактный", "2-тактный"] },
    { label: "Длина ноги", options: ["S (381 мм)", "L (508 мм)", "X (635 мм)"] },
    { label: "Подъем", options: ["гидравлический", "ручной", "ручной (гидродемпфер)", "ручной (демпфер)"] },
    { label: "Компрессия", placeholder: "напр. 15/15/15" },
    { label: "Давление масла", placeholder: "напр. 5 кг" },
    { label: "Наработка", placeholder: "напр. 415 моточасов" },
    { label: "Управление", options: ["дистанционное", "румпельное", "ручное"] },
    { label: "Комплект", options: ["машинка управления", "пульт управления", "мультирумпель", "без комплекта"] },
    { label: "Возможность увеличения мощности", options: ["до 20 л.с.", "до 40 л.с.", "до 60 л.с.", "до 90 л.с.", "нет"] }
  ];
  var TEMPLATE_LABELS = SPEC_TEMPLATE.map(function (f) { return f.label; });

  function isPartsBrand() {
    return fBrand.value === "parts";
  }

  // Значения шаблона и «свои» характеристики держим отдельно от specState:
  // иначе при перерисовке формы (например, после переключения бренда на запчасти
  // и обратно) заполненные пункты шаблона потерялись бы.
  var templateValues = {};
  var customSpecs = [];

  // Раскладывает specs мотора на шаблонную часть и всё остальное.
  function loadSpecs(specs) {
    templateValues = {};
    customSpecs = [];
    (specs || []).forEach(function (s) {
      if (TEMPLATE_LABELS.indexOf(s[0]) !== -1 && templateValues[s[0]] === undefined) templateValues[s[0]] = s[1];
      else customSpecs.push([s[0], s[1]]);
    });
    collectSpecs();
  }

  // Собирает specState: сначала 11 пунктов шаблона по порядку, потом свои.
  function collectSpecs() {
    var result = [];
    if (!isPartsBrand()) {
      TEMPLATE_LABELS.forEach(function (label) {
        result.push([label, templateValues[label] || ""]);
      });
    }
    specState = result.concat(customSpecs);
  }

  addSpecBtn.addEventListener("click", function () {
    customSpecs.push(["", ""]);
    collectSpecs();
    renderSpecs();
  });

  fBrand.addEventListener("change", function () {
    collectSpecs();
    renderSpecs();
  });

  function renderSpecs() {
    var byLabel = templateValues;
    var custom = customSpecs;

    var html = "";

    if (!isPartsBrand()) {
      html += SPEC_TEMPLATE.map(function (field, i) {
        var value = byLabel[field.label] || "";
        var control;
        if (field.options) {
          var known = field.options.indexOf(value) !== -1;
          var isOther = value !== "" && !known;
          control =
            '<select class="form-control spec-select" data-label="' + escapeAttr(field.label) + '">' +
              '<option value=""' + (value === "" ? " selected" : "") + ">— не указано</option>" +
              field.options.map(function (opt) {
                return '<option value="' + escapeAttr(opt) + '"' + (opt === value ? " selected" : "") + ">" + opt + "</option>";
              }).join("") +
              '<option value="__other__"' + (isOther ? " selected" : "") + ">Другое…</option>" +
            "</select>" +
            '<input type="text" class="form-control spec-other" data-label="' + escapeAttr(field.label) + '"' +
              ' placeholder="свой вариант" value="' + escapeAttr(isOther ? value : "") + '"' +
              (isOther ? "" : ' style="display:none;"') + ">";
        } else {
          control =
            '<input type="text" class="form-control spec-text" data-label="' + escapeAttr(field.label) + '"' +
              ' placeholder="' + escapeAttr(field.placeholder || "") + '" value="' + escapeAttr(value) + '">';
        }
        return (
          '<div class="admin-spec-row admin-spec-row--fixed">' +
            '<span class="admin-spec-label">' + (i + 1) + ". " + field.label + "</span>" +
            '<div class="admin-spec-control">' + control + "</div>" +
          "</div>"
        );
      }).join("");
    }

    html += custom.map(function (s, ci) {
      return (
        '<div class="admin-spec-row admin-spec-row--custom" data-ci="' + ci + '">' +
          '<input type="text" class="form-control spec-key" placeholder="Своя характеристика" value="' + escapeAttr(s[0]) + '">' +
          '<input type="text" class="form-control spec-val" placeholder="Значение" value="' + escapeAttr(s[1]) + '">' +
          '<button type="button" class="admin-row-remove" data-ci="' + ci + '">✕</button>' +
        "</div>"
      );
    }).join("");

    specListEl.innerHTML = html;

    specListEl.querySelectorAll(".spec-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var label = sel.getAttribute("data-label");
        var other = specListEl.querySelector('.spec-other[data-label="' + label + '"]');
        if (sel.value === "__other__") {
          other.style.display = "";
          other.focus();
          byLabel[label] = other.value.trim();
        } else {
          other.style.display = "none";
          other.value = "";
          byLabel[label] = sel.value;
        }
        collectSpecs();
      });
    });
    specListEl.querySelectorAll(".spec-other, .spec-text").forEach(function (input) {
      input.addEventListener("input", function () {
        byLabel[input.getAttribute("data-label")] = input.value;
        collectSpecs();
      });
    });
    specListEl.querySelectorAll(".admin-spec-row--custom").forEach(function (row) {
      var ci = parseInt(row.getAttribute("data-ci"), 10);
      row.querySelector(".spec-key").addEventListener("input", function (e) {
        custom[ci][0] = e.target.value;
        collectSpecs();
      });
      row.querySelector(".spec-val").addEventListener("input", function (e) {
        custom[ci][1] = e.target.value;
        collectSpecs();
      });
    });
    specListEl.querySelectorAll(".admin-row-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        custom.splice(parseInt(btn.getAttribute("data-ci"), 10), 1);
        collectSpecs();
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
      // Шаблонные пункты сохраняем даже пустыми, чтобы список характеристик
      // у всех моторов оставался одинаковым; из своих отбрасываем безымянные.
      specs: specState.filter(function (s) {
        return TEMPLATE_LABELS.indexOf(s[0]) !== -1 || s[0].trim();
      })
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
