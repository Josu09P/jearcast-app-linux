// src/scripts/LoginUserScript.js
import { loginUser } from "../domain/usecase/LoginUser";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const submitBtn = form?.querySelector('button[type="submit"]');

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Desactivar botón y mostrar mensaje de inicio de sesión
    submitBtn.disabled = true;
    submitBtn.textContent = "Iniciando sesión...";

    Toastify({
      text: "🔐 Iniciando sesión... por favor espere",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#0d6efd",
      stopOnFocus: false,
    }).showToast();

    try {
      const userData = await loginUser({ email, password });

      // Guardar usuario en localStorage
      localStorage.setItem("userJearCastaInfo", JSON.stringify([userData]));

      Toastify({
        text: `✅ Inicio de sesión exitoso. ¡Bienvenido, ${userData.name}!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#198754",
        stopOnFocus: true,
      }).showToast();

      setTimeout(() => {
        window.location.href = "/dashboard/home";
      }, 1000);
    } catch (error) {
      Toastify({
        text: "❌ Error: " + error.message,
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: "#dc3545",
        stopOnFocus: true,
      }).showToast();

      // Rehabilitar botón
      submitBtn.disabled = false;
      submitBtn.textContent = "Iniciar sesión";
    }
  });
});
