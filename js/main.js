// ===== МОТОР-ВЛ: общие скрипты для всех страниц =====

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Мобильное меню ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileNavClose = document.querySelector(".mobile-nav__close");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.add("open");
    });
  }
  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener("click", function () {
      mobileNav.classList.remove("open");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target === mobileNav) mobileNav.classList.remove("open");
    });
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Счётчики цифр (18 лет, отзывы и т.д.) ---------- */
  var counters = document.querySelectorAll("[data-counter]");
  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-counter"), 10);
    var started = false;
    var run = function () {
      if (started) return;
      started = true;
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 40));
      var timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString("ru-RU");
      }, 30);
    };
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { run(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      obs.observe(el);
    } else {
      run();
    }
  });

  /* ---------- Отзывы: лента с кнопками ---------- */
  var track = document.querySelector(".reviews-track");
  var prevBtn = document.querySelector("[data-review-prev]");
  var nextBtn = document.querySelector("[data-review-next]");
  if (track && prevBtn && nextBtn) {
    var scrollAmount = 344;
    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  /* ---------- Аккордеон (FAQ) ---------- */
  document.querySelectorAll(".accordion-item__head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".accordion-item");
      var body = item.querySelector(".accordion-item__body");
      var isOpen = item.classList.contains("open");

      document.querySelectorAll(".accordion-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".accordion-item__body").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        body.style.maxHeight = null;
      } else {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- Кнопка "наверх" ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Лайтбокс для фото моторов ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector(".lightbox__caption");
    var closeBtn = lightbox.querySelector(".lightbox__close");

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (trigger) {
        lightboxImg.src = trigger.getAttribute("data-lightbox");
        lightboxCaption.textContent = trigger.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
      }
    });
    closeBtn.addEventListener("click", function () {
      lightbox.classList.remove("open");
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }

  /* ---------- Подсветка активного пункта меню ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main-nav a, .mobile-nav__panel a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here) a.classList.add("active");
  });
});
