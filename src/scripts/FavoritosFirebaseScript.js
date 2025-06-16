import { addFavoriteMusic } from "../domain/usecase/AddFavoriteMusic";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (e) => {
    const target = e.target;

    if (target.classList.contains("favorite-btn")) {
      const userDataRaw = localStorage.getItem("userJearCastaInfo");
      if (!userDataRaw) {
        Toastify({
          text: "Usuario no autenticado",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#dc3545",
        }).showToast();
        return;
      }

      // Bloquear botón
      target.disabled = true;

      const user = JSON.parse(userDataRaw)[0];
      const userId = user?.id;
      if (!userId) return;

      const videoId = target.dataset.videoId;
      const title = target.dataset.title;
      const thumbnail = target.dataset.thumbnail;

      try {
        const result = await addFavoriteMusic({
          user_id: userId,
          video_id: videoId,
          video_title: title,
          video_thumbnail: thumbnail,
        });

        if (result === "added") {
          Toastify({
            text: "Agregado a favoritos",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#198754",
          }).showToast();
        } else {
          Toastify({
            text: "Ya está en tus favoritos",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ffc107",
          }).showToast();
        }
      } catch (error) {
        Toastify({
          text: "Error: " + error.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#dc3545",
        }).showToast();
      } finally {
        // Reactivar botón
        target.disabled = false;
      }
    }
  });
});
