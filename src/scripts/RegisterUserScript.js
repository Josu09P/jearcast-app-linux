// src/scripts/RegisterUserScript.js
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { registerUser } from "../domain/usecase/RegisterUser";

// Función para validar API Key de YouTube
async function isYoutubeApiKeyValid(apiKey) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=prueba&type=video&maxResults=1&key=${apiKey}`
    );
    const data = await res.json();
    return !data.error; // true si no hay error
  } catch (e) {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Bloquear el botón para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = "Registrando...";

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const apikeyYoutube = document.getElementById("apikeyYoutube")?.value.trim();

    // Mostrar mensaje de espera mientras se valida
    Toastify({
      text: "Verificando datos... Probando API Key de YouTube",
      duration: 3000,
      style: { background: "#0d6efd" },
    }).showToast();

    // (opcional) Darle tiempo a que se vea el mensaje
    await new Promise((resolve) => setTimeout(resolve, 500));

    const validApiKey = await isYoutubeApiKeyValid(apikeyYoutube);

    if (!validApiKey) {
      Toastify({
        text: "❌ La API Key de YouTube no es válida.",
        duration: 4000,
        style: { background: "#dc3545" },
      }).showToast();

      submitBtn.disabled = false;
      submitBtn.textContent = "Registrarme";
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        confirmPassword,
        apikeyYoutube,
      });

      Toastify({
        text: "✅ Registro exitoso. ¡Bienvenido!",
        duration: 3000,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
      }).showToast();

      setTimeout(() => (window.location.href = "/auth/LoginPage"), 2000);
    } catch (error) {
      Toastify({
        text: error.message || "Error al registrar",
        duration: 4000,
        style: { background: "#e63946" },
      }).showToast();

      // Rehabilitar el botón en caso de error
      submitBtn.disabled = false;
      submitBtn.textContent = "Registrarme";
    }
  });
});
