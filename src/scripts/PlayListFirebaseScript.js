import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { addSongToPlaylist } from "../domain/usecase/AddSongToPlaylist";
import { createOrGetPlaylist } from "../domain/usecase/CreateOrGetPlaylist";
import { fetchPlaylistsByUserId } from "../domain/usecase/GetPlaylistsByUserId";
import { checkIfSongExists } from "../domain/usecase/CheckIfSongExists"; // <-- NUEVA IMPORTACIÓN
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

let currentVideoData = null;

// Escucha el botón de agregar playlist
document.body.addEventListener("click", async (e) => {
  const target = e.target.closest(".playlist-btn");
  if (!target) return;

  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  if (!userDataRaw) return;
  const user = JSON.parse(userDataRaw)[0];
  const userId = user?.id;
  if (!userId) return;

  currentVideoData = {
    user_id: userId,
    video_id: target.getAttribute("data-video-id"),
    title: target.getAttribute("data-title"),
    thumbnail: target.getAttribute("data-thumbnail"),
  };

  // Cargar playlists existentes
  const playlists = await fetchPlaylistsByUserId(userId);
  const container = document.getElementById("playlistList");
  container.innerHTML = "";

  playlists.forEach((playlist) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-light btn-sm";
    btn.textContent = playlist.name;
    btn.addEventListener("click", () => {
      document.getElementById("playlistNameInput").value = playlist.name;
    });
    container.appendChild(btn);
  });

  const modal = new bootstrap.Modal(document.getElementById("playlistModal"));
  modal.show();
});

// Confirmar agregar canción
document.getElementById("confirmAddToPlaylist")?.addEventListener("click", async () => {
  const confirmBtn = document.getElementById("confirmAddToPlaylist");
  const playlistNameInput = document.getElementById("playlistNameInput");
  const playlistName = playlistNameInput.value.trim();

  if (!playlistName || !currentVideoData) return;

  try {
    // Deshabilitar botón y mostrar spinner
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...`;

    const playlistId = await createOrGetPlaylist({
      user_id: currentVideoData.user_id,
      name: playlistName,
    });

    // ✅ Validar si ya existe esa canción en la playlist
    const alreadyExists = await checkIfSongExists(playlistId, currentVideoData.video_id);
    if (alreadyExists) {
      Toastify({
        text: "La música ya existe en tu playlist",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ffc107", // Amarillo
      }).showToast();

      confirmBtn.disabled = false;
      confirmBtn.textContent = "Agregar";
      return;
    }

    // Agregar canción si no existe
    await addSongToPlaylist(playlistId, {
      video_id: currentVideoData.video_id,
      video_title: currentVideoData.title,
      video_thumbnail: currentVideoData.thumbnail,
    });

    Toastify({
      text: `Agregado a playlist: ${playlistName}`,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#198754", // Verde
    }).showToast();

    // Cerrar modal
    const modalEl = document.getElementById("playlistModal");
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }

    // Limpiar input y restaurar botón
    playlistNameInput.value = "";
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Agregar";

  } catch (error) {
    Toastify({
      text: "Error al agregar a la playlist",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#dc3545", // Rojo
    }).showToast();

    confirmBtn.disabled = false;
    confirmBtn.textContent = "Agregar";
  }
});
