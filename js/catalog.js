// ===== МОТОР-ВЛ: логика страницы каталога =====

document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("motorGrid");
  var tabsWrap = document.getElementById("brandTabs");
  var sortSelect = document.getElementById("sortSelect");
  var resultsCount = document.getElementById("resultsCount");
  if (!grid || !tabsWrap) return;

  var currentBrand = "all";
  var currentSort = "default";

  function formatPrice(n) {
    return n.toLocaleString("ru-RU") + " ₽";
  }

  function renderTabs() {
    tabsWrap.innerHTML = BRANDS.map(function (b) {
      var count = b.key === "all" ? MOTORS.length : MOTORS.filter(function (m) { return m.brand === b.key; }).length;
      return '<button class="brand-tab' + (b.key === currentBrand ? " active" : "") + '" data-brand="' + b.key + '">' +
        b.label + '<span class="count">(' + count + ')</span></button>';
    }).join("");

    tabsWrap.querySelectorAll(".brand-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentBrand = btn.getAttribute("data-brand");
        renderTabs();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    var list = MOTORS.filter(function (m) {
      return currentBrand === "all" || m.brand === currentBrand;
    });

    if (currentSort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    if (currentSort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });

    if (resultsCount) {
      resultsCount.textContent = "Найдено моторов: " + list.length;
    }

    grid.innerHTML = list.map(function (m, i) {
      var specsHtml = m.specs.map(function (s) {
        return "<div><em>" + s[0] + "</em><b>" + s[1] + "</b></div>";
      }).join("");

      var badgeHtml = m.badge
        ? '<span class="motor-card__badge' + (m.badge === "Новый" ? " motor-card__badge--new" : "") + '">' + m.badge + "</span>"
        : "";

      var orderUrl = "order.html?motor=" + encodeURIComponent(m.title);

      return (
        '<div class="motor-card reveal in">' +
          '<div class="motor-card__media">' +
            badgeHtml +
            '<img src="' + m.img + '" alt="' + m.title + '" loading="lazy" data-lightbox="' + m.img + '" data-caption="' + m.title + '">' +
          "</div>" +
          '<div class="motor-card__body">' +
            '<p class="motor-card__title">' + m.title + "</p>" +
            '<div class="motor-card__price">' + formatPrice(m.price) + "<span>Цена, готов к работе</span></div>" +
            '<div class="spec-list">' + specsHtml + "</div>" +
            '<div class="motor-card__actions">' +
              '<a class="btn btn--outline" href="' + orderUrl + '">Уточнить наличие</a>' +
              '<a class="btn btn--accent" href="' + orderUrl + '">Оставить заявку</a>' +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      currentSort = sortSelect.value;
      renderGrid();
    });
  }

  // Если пришли по ссылке с якорем бренда, например catalog.html#honda
  var hashBrand = location.hash.replace("#", "");
  if (BRANDS.some(function (b) { return b.key === hashBrand; })) {
    currentBrand = hashBrand;
  }

  renderTabs();
  renderGrid();
});
