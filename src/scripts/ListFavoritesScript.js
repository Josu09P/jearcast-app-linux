import { getFavoritesByUser } from "../domain/usecase/GetFavoritesByUser";
import { removeFavoriteMusic } from "../domain/usecase/RemoveFavoriteMusic";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Lottie from "lottie-web";

let ytPlayer;
let currentVideoIndex = 0;
let currentVideos = [];

function waitForYT() {
  if (window.YT && window.YT.Player) {
    const playerIframe = document.getElementById("youtube-player-favorites");
    if (!playerIframe) return;

    ytPlayer = new YT.Player(playerIframe, {
      events: {
        onReady: () => {
          setupCustomControls();
          ytPlayer.playVideo();

          const equalizer = document.getElementById("music-equalizer-favorites");
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
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            const nextIndex = currentVideoIndex + 1;
            if (nextIndex < currentVideos.length) {
              renderPlayer(currentVideos[nextIndex], nextIndex);
            } else {
              const equalizer = document.getElementById("music-equalizer-favorites");
              equalizer?.classList.add("d-none");
              window.lottieEqualizer?.stop();
            }
          }
        },
      },
    });
  } else {
    setTimeout(waitForYT, 300);
  }
}

function setupCustomControls() {
  const playBtn = document.getElementById("btn-play-favorites");
  const pauseBtn = document.getElementById("btn-pause-favorites");
  const nextBtn = document.getElementById("btn-next-favorites");
  const prevBtn = document.getElementById("btn-prev-favorites");
  const progressBar = document.getElementById("progress-bar-favorites");
  const equalizer = document.getElementById("music-equalizer-favorites");
  const overlay = document.getElementById("overlay-blocker-favorites");

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

  const volumeControl = document.getElementById("volume-control-favorites");
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

function renderPlayer(video, index) {
  currentVideoIndex = index;
  const container = document.getElementById("player-favorites-container");
  if (!container) return;

  container.innerHTML = `
    <div class="d-flex player-layout-wrapper">
      <div class="video-wrapper-half">
        <iframe
          id="youtube-player-favorites"
          src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&enablejsapi=1&controls=0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
        <div class="overlay-blocker" id="overlay-blocker-favorites"></div>
      </div>

      <div class="player-controls-half d-flex flex-column align-items-center justify-content-between text-center">
        <h6 class="mb-2 player-title">${video.title}</h6>

        <div id="music-equalizer-favorites" style="width: 200px; max-width: 100%;"></div>

        <input
          id="progress-bar-favorites"
          type="range"
          min="0"
          max="100"
          value="0"
          step="1"
          class="form-range w-100"
        />

        <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2 mt-3">
          <div class="d-flex gap-3 align-items-center">
            <button id="btn-prev-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-start-fill fs-4"></i>
            </button>
            <button id="btn-play-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-play-fill fs-4"></i>
            </button>
            <button id="btn-pause-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-pause-fill fs-4"></i>
            </button>
            <button id="btn-next-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-end-fill fs-4"></i>
            </button>
          </div>

          <div class="volume-wrapper">
            <i class="bi bi-volume-up volume-icon"></i>
            <input
              type="range"
              id="volume-control-favorites"
              min="0"
              max="100"
              value="100"
              step="1"
              class=" volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(waitForYT, 100);
}
/* 
* PARA PAUSAR OTROS PLAYERS SI ESTE ESA EN USO:
function pauseOtherPlayers() {
  const players = [
    { id: "youtube-player", container: "player-home-container" },
    { id: "youtube-player-recommended", container: "player-recommended-container" },
  ];

  players.forEach(({ id, container }) => {
    const iframe = document.getElementById(id);
    const parent = document.getElementById(container);

    // Pausar el reproductor
    try {
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      );
    } catch (e) {
      console.warn(`No se pudo pausar ${id}`);
    }

    // Aplicar blur al contenedor
    if (parent) {
      parent.classList.add("blurred-player");
    }
  });
}

*/
async function reloadFavorites() {
  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  const container = document.getElementById("favorites-results");
  if (!userDataRaw || !container) return;

  const user = JSON.parse(userDataRaw)[0];

  try {
    const favorites = await getFavoritesByUser(user.id);

    container.innerHTML = "";

    if (favorites.length === 0) {
      container.innerHTML = `<div class="text-white p-4">No tienes favoritos aún.</div>`;
      return;
    }

    currentVideos = favorites.map((f) => ({
      videoId: f.video_id,
      title: f.video_title,
      thumbnail: f.video_thumbnail,
    }));

    favorites.forEach((fav) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-6 col-xl-3 mb-3";
      col.innerHTML = `
        <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
          <img src="${fav.video_thumbnail}" alt="${fav.video_title}" style="width: 120px; height: 80px; object-fit: cover;" class="rounded-start me-3" />
          <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
            <h6 class="card-title text-truncate mb-1" title="${fav.video_title}" style="font-size: 0.85rem;">${fav.video_title}</h6>
            <div class="d-flex justify-content-start gap-2" style="margin: 10px 0 0 20px">
              <button class="btn btn-sm play-btn" data-video-id="${fav.video_id}"><i class="bi bi-play-circle"></i></button>
              <button class="btn btn-sm remove-favorite-btn" data-video-id="${fav.video_id}"><i class="bi bi-trash-fill"></i></button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
      /*  pauseOtherPlayers(); */
        const videoId = btn.getAttribute("data-video-id");
        const index = currentVideos.findIndex((v) => v.videoId === videoId);
        if (index !== -1) {
          renderPlayer(currentVideos[index], index);
        }
      });
    });

    document.querySelectorAll(".remove-favorite-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const videoId = btn.getAttribute("data-video-id");
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Borrando...';

        try {
          await removeFavoriteMusic({ user_id: user.id, video_id: videoId });
          Toastify({ text: "Eliminado de favoritos", duration: 3000, gravity: "top", position: "right", backgroundColor: "#198754" }).showToast();
          await reloadFavorites();
        } catch (error) {
          console.error("Error al eliminar de favoritos:", error);
          Toastify({ text: "Error al eliminar de favoritos", duration: 3000, gravity: "top", position: "right", backgroundColor: "#dc3545" }).showToast();
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        }
      });
    });
  } catch (error) {
    console.error("Error al recargar favoritos:", error);
    container.innerHTML = `<div class="text-danger p-4">Error recargando favoritos.</div>`;
  }
}

// Evento de recarga del botón
document.addEventListener("DOMContentLoaded", () => {
  reloadFavorites();

  const reloadBtn = document.getElementById("reload-favorites-btn");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", async () => {
      reloadBtn.disabled = true;
      reloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cargando...`;

      await reloadFavorites();

      reloadBtn.disabled = false;
      reloadBtn.innerHTML = `<i class="bi bi-arrow-clockwise me-1"></i> Actualizar favoritos`;
    });
  }
});
