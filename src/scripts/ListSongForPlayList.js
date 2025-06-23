import { fetchPlaylistsByUserId } from "../domain/usecase/GetPlaylistsByUserId";
import { fetchSongsByPlaylistId } from "../domain/usecase/GetSongsByPlaylistId";
import { deletePlaylist } from "../domain/usecase/DeletePlaylist";
import { deleteSongFromPlaylist } from "../domain/usecase/DeleteSongFromPlaylist";
import Lottie from "lottie-web";
import Swal from "sweetalert2";

let selectedPlaylistId = null;
let ytPlayer;
let currentVideoIndex = 0;
let currentVideos = [];

const waitForYT = () => {
  if (window.YT && window.YT.Player) {
    const playerIframe = document.getElementById("youtube-player-playlist");

    ytPlayer = new YT.Player(playerIframe, {
      events: {
        onReady: () => {
          setupCustomControls();
          ytPlayer.playVideo();
          const equalizer = document.getElementById("music-equalizer-playlist");
          if (equalizer && !equalizer.querySelector("svg")) {
            const lottieAnimation = Lottie.loadAnimation({
              container: equalizer,
              renderer: "svg",
              loop: true,
              autoplay: true,
              path: "/src/assets/animations/animation-sound2.json",
            });

            window.lottieEqualizer = lottieAnimation;

            lottieAnimation.addEventListener("DOMLoaded", () => {
              console.log("✅ Animación Lottie cargada");
            });

            const playBtn = document.getElementById("btn-play-playlist");
            const pauseBtn = document.getElementById("btn-pause-playlist");

            playBtn?.addEventListener("click", () => {
              ytPlayer.playVideo();
              equalizer.classList.remove("d-none");
              lottieAnimation.play();
            });

            pauseBtn?.addEventListener("click", () => {
              ytPlayer.pauseVideo();
              equalizer.classList.add("d-none");
              lottieAnimation.stop();
            });
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            const nextIndex = currentVideoIndex + 1;
            if (nextIndex < currentVideos.length) {
              renderPlayer(currentVideos[nextIndex], nextIndex);
            } else {
              const equalizer = document.getElementById("music-equalizer-playlist");
              equalizer?.classList.add("d-none");
            }
          }
        },
      },
    });
  } else {
    setTimeout(waitForYT, 300);
  }
};

function setupCustomControls() {
  const playBtn = document.getElementById("btn-play-playlist");
  const pauseBtn = document.getElementById("btn-pause-playlist");
  const nextBtn = document.getElementById("btn-next-playlist");
  const prevBtn = document.getElementById("btn-prev-playlist");
  const progressBar = document.getElementById("progress-bar-playlist");
  const equalizer = document.getElementById("music-equalizer-playlist");
  const overlay = document.getElementById("overlay-blocker-playlist");

  let isPaused = false;

  const checkOverlayFade = () => {
    if (isPaused || !ytPlayer || typeof ytPlayer.getCurrentTime !== "function") return;

    const currentTime = ytPlayer.getCurrentTime();
    const duration = ytPlayer.getDuration();
    if (!duration || duration === 0) return;

    if (currentTime <= 7) {
      overlay?.classList.remove("transparent");
    } else if (currentTime > 7 && currentTime < duration - 17) {
      overlay?.classList.add("transparent");
    } else if (currentTime >= duration - 17) {
      overlay?.classList.remove("transparent");
    }
  };

  setInterval(checkOverlayFade, 1000);

  playBtn?.addEventListener("click", () => {
    ytPlayer.playVideo();
    isPaused = false;
    equalizer?.classList.remove("d-none");
    window.lottieEqualizer?.play();

    overlay?.classList.add("transparent"); // aplicar al instante
  });

  pauseBtn?.addEventListener("click", () => {
    ytPlayer.pauseVideo();
    isPaused = true;
    equalizer?.classList.add("d-none");
    window.lottieEqualizer?.stop();

    overlay?.classList.remove("transparent"); // opacar al instante
  });

  nextBtn?.addEventListener("click", () => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < currentVideos.length) {
      renderPlayer(currentVideos[nextIndex], nextIndex);
    }
  });

  prevBtn?.addEventListener("click", () => {
    const prevIndex = currentVideoIndex - 1;
    if (prevIndex >= 0) {
      renderPlayer(currentVideos[prevIndex], prevIndex);
    }
  });

  setInterval(() => {
    if (ytPlayer && ytPlayer.getDuration) {
      const duration = ytPlayer.getDuration();
      const currentTime = ytPlayer.getCurrentTime();
      if (duration && progressBar) {
        progressBar.value = ((currentTime / duration) * 100).toFixed(0);
      }
    }
  }, 1000);

  progressBar?.addEventListener("input", () => {
    const duration = ytPlayer.getDuration();
    if (duration) {
      const seekTime = (progressBar.value / 100) * duration;
      ytPlayer.seekTo(seekTime, true);
    }
  });

  const volumeControl = document.getElementById("volume-control-playlist");
  if (volumeControl) {
    if (ytPlayer && ytPlayer.setVolume) {
      ytPlayer.setVolume(100);
    }

    volumeControl.addEventListener("input", () => {
      const volumeValue = parseInt(volumeControl.value, 10);
      if (ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(volumeValue);
      }
    });
  }
}

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

const userDataRaw = localStorage.getItem("userJearCastaInfo");

if (userDataRaw) {
  try {
    const userData = JSON.parse(userDataRaw);
    apiKey = userData[0]?.apikeyYoutube || null;
  } catch (error) {
    console.error("Error parsing userJearCastaInfo:", error);
  }
}

const playerContainer = document.getElementById("player-playlist-container");

const renderPlayer = (video, index) => {
  currentVideoIndex = index;

  playerContainer.innerHTML = `
  <div class="d-flex player-layout-wrapper">
    <div class="video-wrapper-half">
      <iframe id="youtube-player-playlist" src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&enablejsapi=1&controls=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      <div class="overlay-blocker" id="overlay-blocker-playlist"></div>
    </div>
    <div class="player-controls-half d-flex flex-column align-items-center justify-content-between text-center">
      <h6 class="mb-2 player-title">${video.title}</h6>
      <div id="music-equalizer-playlist" style="width: 200px; max-width: 100%;"></div>
      <input id="progress-bar-playlist" type="range" min="0" max="100" value="0" step="1" class="form-range w-100" />
      <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2 mt-3">
        <div class="d-flex gap-3 align-items-center">
          <button id="btn-prev-playlist" class="btn btn-outline-light btn-sm"><i class="bi bi-skip-start-fill fs-4"></i></button>
          <button id="btn-play-playlist" class="btn btn-outline-light btn-sm"><i class="bi bi-play-fill fs-4"></i></button>
          <button id="btn-pause-playlist" class="btn btn-outline-light btn-sm"><i class="bi bi-pause-fill fs-4"></i></button>
          <button id="btn-next-playlist" class="btn btn-outline-light btn-sm"><i class="bi bi-skip-end-fill fs-4"></i></button>
        </div>
        <div class="volume-wrapper">
          <i class="bi bi-volume-up volume-icon"></i>
          <input type="range" id="volume-control-playlist" min="0" max="100" value="100" step="1" class="volume-slider" />
        </div>
      </div>
    </div>
  </div>
  `;

  waitForYT();
  setupCustomControls();
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ ListSongForPlayList.js cargado correctamente");

  const reloadBtn = document.getElementById("reload-playlists-btn");

  reloadBtn?.addEventListener("click", async () => {
    reloadBtn.disabled = true;
    reloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Recargando...`;

    await loadUserPlaylists(); // Recarga todo

    reloadBtn.disabled = false;
    reloadBtn.innerHTML = `<i class="bi bi-arrow-clockwise me-1"></i> Recargar mis playlists`;
  });

  await loadUserPlaylists(); // Primera carga
});

async function loadUserPlaylists() {
  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  const playlistContainer = document.getElementById("playlistContainer");
  const songsContainer = document.getElementById("songsContainer");
  if (!userDataRaw || !playlistContainer || !songsContainer) return;

  const parsed = JSON.parse(userDataRaw);
  const user = Array.isArray(parsed) ? parsed[0] : parsed;
  const userId = user?.id;
  if (!userId) return;

  const playlists = await fetchPlaylistsByUserId(userId);
  playlistContainer.innerHTML = "";

  if (playlists.length === 0) {
    playlistContainer.innerHTML = `<p class="text-white">No tienes playlists aún.</p>`;
    songsContainer.innerHTML = "";
    return;
  }

  playlists.forEach((playlist, idx) => {
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex align-items-center gap-2";

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-light btn-sm";
    btn.textContent = playlist.name;
    btn.addEventListener("click", () => loadSongsForPlaylist(playlist.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger btn-sm";
    deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
    deleteBtn.addEventListener("click", async () => {
      const result = await Swal.fire({
        title: "¿Eliminar esta playlist?",
        text: "Se eliminarán todas las canciones dentro de ella",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await deletePlaylist(playlist.id);
        btnGroup.remove();
        songsContainer.innerHTML = "";
        Swal.fire("Eliminada", "La playlist ha sido eliminada.", "success");
      }
    });

    btnGroup.appendChild(btn);
    btnGroup.appendChild(deleteBtn);
    playlistContainer.appendChild(btnGroup);

    // 👉 Autocargar la primera playlist y reproducir la primera canción
    if (idx === 0) {
      loadSongsForPlaylist(playlist.id, true);
    }
  });
}

async function loadSongsForPlaylist(playlistId = false) {
  selectedPlaylistId = playlistId;
  const songsContainer = document.getElementById("songsContainer");

  songsContainer.innerHTML = `<div class="text-white">Cargando canciones...</div>`;
  const songs = await fetchSongsByPlaylistId(playlistId);
  songsContainer.innerHTML = "";

  if (songs.length === 0) {
    songsContainer.innerHTML = `<div class="text-white">No hay canciones en esta playlist.</div>`;
    return;
  }

  currentVideos = songs.map((s) => ({
    videoId: s.video_id,
    title: s.video_title,
    thumbnail: s.video_thumbnail,
  }));

  songs.forEach((song) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-3 mb-3";

    col.innerHTML = `
      <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
        <img src="${song.video_thumbnail}" alt="${song.video_title}" style="width: 120px; height: 80px; object-fit: cover;" class="rounded-start me-3" />
        <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
          <h6 class="card-title text-truncate mb-1" title="${song.video_title}" style="font-size: 0.85rem;">${song.video_title}</h6>
          <div class="d-flex justify-content-center align-items-center gap-2 mt-2">
            <button class="btn btn-sm btn-outline-danger play-playlist-btn" data-video-id="${song.video_id}" data-title="${song.video_title}">
              <i class="bi bi-play-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-song-btn" data-song-id="${song.video_id}">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    songsContainer.appendChild(col);
  });

  document.querySelectorAll(".delete-song-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const videoId = btn.getAttribute("data-song-id");
      const result = await Swal.fire({
        title: "¿Eliminar esta canción?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await deleteSongFromPlaylist(selectedPlaylistId, videoId);
        await btn.closest(".col-12")?.remove();
        Swal.fire("Eliminado", "La canción ha sido eliminada.", "success");
      }
    });
  });

  document.querySelectorAll(".play-playlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoId = btn.getAttribute("data-video-id");
      const index = currentVideos.findIndex((v) => v.videoId === videoId);
      if (index !== -1) renderPlayer(currentVideos[index], index);
    });
  });

}

