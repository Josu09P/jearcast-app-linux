import { getFavoritesByUser } from "../domain/usecase/GetFavoritesByUser";

document.addEventListener("DOMContentLoaded", async () => {
  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  if (!userDataRaw) return;

  const user = JSON.parse(userDataRaw)[0];
  const container = document.getElementById("favorites-results");

  if (!container) return;

  try {
    const favorites = await getFavoritesByUser(user.id);

    if (favorites.length === 0) {
      container.innerHTML = `
        <div class="text-white p-4">No tienes favoritos aún.</div>
      `;
      return;
    }

    container.innerHTML = ""; // limpiar antes de insertar

    favorites.forEach((fav) => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="card shadow-sm h-100 bg-dark text-white border-light">
          <img src="${fav.video_thumbnail}" class="card-img-top" alt="${fav.video_title}">
          <div class="card-body">
            <h5 class="card-title">${fav.video_title}</h5>
            <audio controls class="w-100">
              <source src="https://www.youtube.com/watch?v=${fav.video_id}" type="audio/mp3">
              Tu navegador no soporta audio.
            </audio>
            <a href="https://www.youtube.com/watch?v=${fav.video_id}" target="_blank" class="btn btn-outline-light mt-2 w-100">
              Ver en YouTube
            </a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  } catch (error) {
    console.error("Error al cargar favoritos:", error);
    container.innerHTML = `
      <div class="text-danger p-4">Error cargando favoritos.</div>
    `;
  }
});
