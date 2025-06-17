import { fetchPlaylistsByUserId } from "../domain/usecase/GetPlaylistsByUserId";
import { fetchSongsByPlaylistId } from "../domain/usecase/GetSongsByPlaylistId";

document.addEventListener("astro:page-load", async () => {
  console.log("✅ ListSongForPlayList.js cargado correctamente");
  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  if (!userDataRaw) return;
  const parsed = JSON.parse(userDataRaw);
  const user = Array.isArray(parsed) ? parsed[0] : parsed;
  const userId = user?.id;
  if (!userId) return;

  const playlistContainer = document.getElementById("playlistContainer");
  const songsContainer = document.getElementById("songsContainer");

  const playlists = await fetchPlaylistsByUserId(userId);
  playlistContainer.innerHTML = "";

  playlists.forEach((playlist) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.textContent = playlist.name;
    btn.addEventListener("click", async () => {
      const songs = await fetchSongsByPlaylistId(playlist.id);
      songsContainer.innerHTML = "";

      if (songs.length === 0) {
        songsContainer.innerHTML = `<p class="text-white">No hay canciones en esta playlist.</p>`;
        return;
      }

      songs.forEach((song) => {
        const col = document.createElement("div");
        col.className = "col";

        col.innerHTML = `
          <div class="card h-100 bg-dark text-white">
            <img src="${song.video_thumbnail}" class="card-img-top" alt="${song.video_title}">
            <div class="card-body">
              <h5 class="card-title">${song.video_title}</h5>
            </div>
          </div>
        `;
        songsContainer.appendChild(col);
      });
    });
    playlistContainer.appendChild(btn);
  });
});
