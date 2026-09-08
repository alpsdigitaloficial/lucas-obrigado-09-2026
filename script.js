// Direção visual: interações discretas da página Planejamento Financeiro Superavit, sem framework ou dependências.
(function () {
  "use strict";

  var form = document.getElementById("lead-form");
  var button = form ? form.querySelector("button[type=submit]") : null;
  var appsScriptUrl = "https://script.google.com/macros/s/AKfycbwU5MQxIxltMKpdPPn1d8gqpF_NZC86xlazUTuBk87uJbwqkakZIdSJGJxy6-nj3Zy4SQ/exec";
  var whatsappUrl = "https://api.whatsapp.com/send/?phone=5561999245689&text=Oi+Jeane%21+Preenchi+o+formul%C3%A1rio+do+Saldo+em+Conta+e+quero+saber+mais+sobre+o+pr%C3%B3ximo+passo.&type=phone_number&app_absent=0";
  var naoQualificadas = ["Até R$ 5.000", "De R$ 5.000 a R$ 7.000"];

  var elements = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(function (element) { observer.observe(element); });
  } else {
    elements.forEach(function (element) { element.classList.add("in"); });
  }

  function getUtms() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      fbclid: params.get("fbclid") || "",
      gclid: params.get("gclid") || ""
    };
  }

  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var honeypot = document.getElementById("site");
    if (honeypot && honeypot.value.trim() !== "") return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    button.disabled = true;
    button.textContent = "Enviando...";
    var data = new FormData(form);
    var payload = {
      nome: String(data.get("nome") || "").trim(),
      email: String(data.get("email") || "").trim(),
      telefone: String(data.get("whatsapp") || "").trim(),
      renda: String(data.get("faixa_renda") || ""),
      dor: String(data.get("maior_dor") || "").trim(),
      autonomia: String(data.get("autonomia") || "").trim(),
      origem: "planejamento-financeiro-superavit-diagnostico",
      data: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    };
    Object.assign(payload, getUtms());

    var endpoint = appsScriptUrl + "?" + new URLSearchParams(payload).toString();
    fetch(endpoint, { method: "GET", mode: "no-cors", keepalive: true }).catch(function () {});

    button.textContent = "Redirecionando...";
    var destination = naoQualificadas.indexOf(String(data.get("faixa_renda"))) !== -1 ? "recebido.html" : whatsappUrl;
    window.setTimeout(function () { window.location.href = destination; }, 600);
  });
}());
