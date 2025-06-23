import { resetPassword } from "../data/firebase/forgot.password";

document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    await resetPassword(email);
    alert("📧 Se ha enviado un enlace de recuperación a tu correo.");
  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error. Verifica el correo e intenta nuevamente.");
  }
});