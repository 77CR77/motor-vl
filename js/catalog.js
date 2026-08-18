// ===== МОТОР-ВЛ: логика страницы каталога =====
// Данные каталога подгружаются из data/motors.json и data/brands.json —
// это позволяет обновлять каталог через админ-панель (/admin) без правки кода.

document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("motorGrid");
  var tabsWrap = document.getElementById("brandTabs");
  var resultsCount = document.getElementById("resultsCount");
  var hpFilterWrap = document.getElementById("hpFilter");
  if (!grid || !tabsWrap) return;

  var MOTORS = [];
  var BRANDS = [];
  var currentBrand = "";

  // Фиксированные диапазоны мощности для кнопок быстрого перехода по списку.
  // Показываются только те диапазоны, для которых в текущем бренде реально есть моторы.
  var HP_RANGES = [
    { min: 0, max: 25, label: "0–25 л.с." },
    { min: 30, max: 60, label: "30–60 л.с." },
    { min: 70, max: Infinity, label: "70+ л.с." }
  ];

  function formatPrice(n) {
    return n.toLocaleString("ru-RU") + " ₽";
  }

  // Извлекает мощность мотора (л.с.) из его названия по номеру модели —
  // у моторов её отдельно не хранится, но она всегда зашита в модель (F25, BF75, DF30, Tohatsu 15...).
  function extractHP(motor) {
    var t = motor.title;
    var m = null;
    if (motor.brand === "yamaha") m = t.match(/F\s?(\d{1,3})/i);
    else if (motor.brand === "honda") m = t.match(/BF\s?(\d{1,3})/i);
    else if (motor.brand === "suzuki") m = t.match(/DF\s?(\d{1,3})/i);
    else if (motor.brand === "tohatsu") m = t.match(/(\d{1,3})/);
    return m ? parseInt(m[1], 10) : null;
  }

  // Определяет, в какой диапазон мощности попадает мотор — используется, чтобы
  // разделить список визуальным промежутком на границах диапазонов.
  function bucketOf(hp) {
    if (hp === null) return null;
    for (var i = 0; i < HP_RANGES.length; i++) {
      if (hp >= HP_RANGES[i].min && hp <= HP_RANGES[i].max) return i;
    }
    return null;
  }

  function sortedList() {
    var list = MOTORS.filter(function (m) {
      return m.brand === currentBrand;
    });
    // От маленьких моторов к большим — сначала минимальная мощность, в конце максимальная.
    list.sort(function (a, b) {
      var ah = extractHP(a); var bh = extractHP(b);
      return (ah === null ? Infinity : ah) - (bh === null ? Infinity : bh);
    });
    return list;
  }

  function renderTabs() {
    tabsWrap.innerHTML = BRANDS.map(function (b) {
      var count = MOTORS.filter(function (m) { return m.brand === b.key; }).length;
      return '<button class="brand-tab' + (b.key === currentBrand ? " active" : "") + '" data-brand="' + b.key + '">' +
        b.label + '<span class="count">(' + count + ')</span></button>';
    }).join("");

    tabsWrap.querySelectorAll(".brand-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentBrand = btn.getAttribute("data-brand");
        renderTabs();
        renderHpFilter();
        renderGrid();
      });
    });
  }

  function renderHpFilter() {
    if (!hpFilterWrap) return;

    // У запчастей нет единой мощности мотора — фильтр там не нужен.
    if (currentBrand === "parts") {
      hpFilterWrap.innerHTML = "";
      hpFilterWrap.style.display = "none";
      return;
    }

    var brandMotors = MOTORS.filter(function (m) { return m.brand === currentBrand; });
    var available = HP_RANGES.filter(function (r) {
      return brandMotors.some(function (m) {
        var hp = extractHP(m);
        return hp !== null && hp >= r.min && hp <= r.max;
      });
    });

    if (!available.length) {
      hpFilterWrap.innerHTML = "";
      hpFilterWrap.style.display = "none";
      return;
    }

    hpFilterWrap.style.display = "";
    hpFilterWrap.innerHTML = '<span class="hp-filter__label">Мощность:</span>' +
      available.map(function (r) {
        return '<button type="button" class="hp-filter__btn" data-min="' + r.min + '" data-max="' + r.max + '">' + r.label + '</button>';
      }).join("");

    hpFilterWrap.querySelectorAll(".hp-filter__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var min = parseFloat(btn.getAttribute("data-min"));
        var max = parseFloat(btn.getAttribute("data-max"));
        jumpToHpRange(min, max);
      });
    });
  }

  function jumpToHpRange(min, max) {
    var list = sortedList();
    var cards = grid.querySelectorAll(".motor-card");
    var targetCard = null;

    for (var i = 0; i < list.length; i++) {
      var hp = extractHP(list[i]);
      if (hp !== null && hp >= min && hp <= max) {
        targetCard = cards[i];
        break;
      }
    }
    if (!targetCard) return;

    // Если перед первым мотором этого диапазона есть разделительная линия — переходим
    // именно на неё (block:"start"), чтобы она оказалась вверху экрана, а моторы диапазона —
    // сразу под ней. Если диапазон самый первый в списке (разделителя перед ним нет,
    // он и так в самом верху) — переходим на первую карточку.
    var bucketIndex = HP_RANGES.findIndex(function (r) { return r.min === min && r.max === max; });
    var divider = grid.querySelector('.motor-grid__divider[data-bucket="' + bucketIndex + '"]');
    var scrollTarget = divider || targetCard;
    scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });

    targetCard.classList.add("motor-card--flash");
    setTimeout(function () { targetCard.classList.remove("motor-card--flash"); }, 1200);
  }

  function renderGrid() {
    var list = sortedList();

    if (resultsCount) {
      resultsCount.textContent = "Найдено позиций: " + list.length;
    }

    var prevBucket = undefined;

    grid.innerHTML = list.map(function (m, i) {
      var hp = extractHP(m);
      var bucket = bucketOf(hp);
      var dividerHtml = "";
      if (bucket !== null && bucket !== prevBucket && prevBucket !== undefined) {
        dividerHtml = '<div class="motor-grid__divider" data-bucket="' + bucket + '"><span>' + HP_RANGES[bucket].label + '</span></div>';
      }
      prevBucket = bucket;

      // Список характеристик у всех моторов одинаковый и в одном порядке
      // (см. tools/normalize_specs.py). Незаполненные пункты показываем прочерком,
      // чтобы таблички у всех моторов совпадали строка в строку.
      var specsHtml = m.specs.map(function (s) {
        var value = s[1];
        return value
          ? "<div><em>" + s[0] + "</em><b>" + value + "</b></div>"
          : '<div class="spec-list__empty"><em>' + s[0] + "</em><b>—</b></div>";
      }).join("");

      var badgeHtml = m.badge
        ? '<span class="motor-card__badge' + (m.badge === "Новый" ? " motor-card__badge--new" : "") + '">' + m.badge + "</span>"
        : "";

      var photos = (m.photos && m.photos.length) ? m.photos : [m.img];
      var videos = m.videos || [];
      var idMatch = m.img.match(/\/media\/(\d+)\//);
      var sourceUrl = idMatch ? "https://www.motor-vl.ru/category/item?id=" + idMatch[1] : "";

      var metaChips = "";
      if (photos.length > 1) metaChips += '<span class="motor-card__meta-chip">📷 ' + photos.length + "</span>";
      if (videos.length) metaChips += '<span class="motor-card__meta-chip">🎬 ' + videos.length + "</span>";
      var metaHtml = metaChips ? '<div class="motor-card__meta">' + metaChips + "</div>" : "";

      return (
        dividerHtml +
        '<div class="motor-card reveal in">' +
          '<div class="motor-card__media">' +
            badgeHtml +
            metaHtml +
            '<img src="' + m.img + '" alt="' + m.title + '" loading="lazy" ' +
              'data-lightbox="' + m.img + '" data-caption="' + m.title + '" ' +
              "data-photos='" + JSON.stringify(photos).replace(/'/g, "&#39;") + "' " +
              "data-videos='" + JSON.stringify(videos).replace(/'/g, "&#39;") + "' " +
              'data-source="' + sourceUrl + '">' +
          "</div>" +
          '<div class="motor-card__body">' +
            '<p class="motor-card__title">' + m.title + "</p>" +
            '<div class="motor-card__price">' + formatPrice(m.price) + "<span>Цена</span></div>" +
            '<div class="spec-list">' + specsHtml + "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function startCatalog(motors, brands) {
    MOTORS = motors;
    BRANDS = brands;

    // Если пришли по ссылке с якорем бренда, например catalog.html#honda
    var hashBrand = location.hash.replace("#", "");
    if (BRANDS.some(function (b) { return b.key === hashBrand; })) {
      currentBrand = hashBrand;
    } else {
      currentBrand = BRANDS.length ? BRANDS[0].key : "";
    }

    renderTabs();
    renderHpFilter();
    renderGrid();
  }

  grid.innerHTML = '<p style="color:var(--text-muted);">Загружаем каталог…</p>';

  Promise.all([
    fetch("data/motors.json").then(function (r) { return r.json(); }),
    fetch("data/brands.json").then(function (r) { return r.json(); })
  ]).then(function (results) {
    startCatalog(results[0], results[1]);
  }).catch(function () {
    // Если страница открыта двойным кликом (файл file://, без веб-сервера), браузер блокирует
    // подгрузку data/*.json через fetch. В этом случае используем копию данных, встроенную
    // прямо в HTML-страницу (см. <script> перед подключением catalog.js) — так каталог
    // работает и при обычном открытии файла. На живом сайте (Netlify) эта заглушка не нужна:
    // fetch отрабатывает первым и подхватывает свежие данные, включая правки из /admin.
    if (window.__MOTORS_FALLBACK__ && window.__BRANDS_FALLBACK__) {
      startCatalog(window.__MOTORS_FALLBACK__, window.__BRANDS_FALLBACK__);
    } else {
      grid.innerHTML = '<p style="color:var(--jp-red);">Не удалось загрузить каталог. Попробуйте обновить страницу.</p>';
    }
  });
});
