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

  // Красивое форматирование номера телефона при вводе: (908) 448-11-00
  var phoneInput = document.getElementById("fieldPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);
      var formatted = "";
      if (digits.length > 0) formatted += "(" + digits.slice(0, 3);
      if (digits.length >= 3) formatted += ") ";
      if (digits.length > 3) formatted += digits.slice(3, 6);
      if (digits.length >= 6) formatted += "-";
      if (digits.length > 6) formatted += digits.slice(6, 8);
      if (digits.length >= 8) formatted += "-";
      if (digits.length > 8) formatted += digits.slice(8, 10);
      phoneInput.value = formatted;
    });
  }

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
