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
  var errorBlock = document.getElementById("orderError");

  // Красивое сообщение вместо стандартного "Установите флажок здесь"
  var consentInput = document.getElementById("fieldConsent");
  if (consentInput) {
    consentInput.addEventListener("invalid", function () {
      consentInput.setCustomValidity("Пожалуйста, подтвердите согласие на обработку персональных данных");
    });
    consentInput.addEventListener("change", function () {
      consentInput.setCustomValidity("");
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";
      if (errorBlock) errorBlock.style.display = "none";

      var phoneCodeEl = document.getElementById("fieldPhoneCode");
      var phoneCode = phoneCodeEl ? phoneCodeEl.value : "+7";
      var phoneNumber = document.getElementById("fieldPhone").value.trim();
      var fullPhone = phoneNumber ? (phoneCode + " " + phoneNumber) : "";

      var payload = {
        action: "submit",
        name: document.getElementById("fieldName").value,
        phone: fullPhone,
        email: document.getElementById("fieldEmail").value,
        motor: document.getElementById("fieldMotor").value,
        message: document.getElementById("fieldMessage").value
      };

      fetch("/.netlify/functions/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          form.style.display = "none";
          if (successBlock) successBlock.classList.add("show");
          window.scrollTo({ top: form.offsetTop - 140, behavior: "smooth" });
        })
        .catch(function () {
          if (errorBlock) errorBlock.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.textContent = "Отправить заявку";
        });
    });
  }
});
