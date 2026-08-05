// ===== МОТОР-ВЛ: логика страницы "Оставить заявку" =====

document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(location.search);
  var motorField = document.getElementById("fieldMotor");
  var motorFromUrl = params.get("motor");

  if (motorField && motorFromUrl) {
    motorField.value = motorFromUrl;
  }
  if (params.get("type") === "japan") {
    var typeField = document.getElementById("fieldMotor");
    if (typeField && !motorFromUrl) {
      typeField.value = "Подбор под заказ из Японии";
    }
  }

  var form = document.getElementById("orderForm");
  var successBlock = document.getElementById("orderSuccess");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // На боевом сайте здесь должен быть запрос к серверу/CRM,
      // который реально отправит заявку менеджеру (email, amoCRM, Bitrix и т.п.)
      form.style.display = "none";
      if (successBlock) successBlock.classList.add("show");
      window.scrollTo({ top: form.offsetTop - 140, behavior: "smooth" });
    });
  }
});
