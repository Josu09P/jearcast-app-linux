import { searchYoutube, getVideoStats } from "/src/data/youtube/searchYoutube";
import { addFavoriteMusic } from "../domain/usecase/AddFavoriteMusic";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Lottie from "lottie-web";

document.addEventListener("DOMContentLoaded", () => {
  let ytPlayer;
  let currentVideoIndex = 0;
  let currentVideos = [];

  const waitForYT = () => {
    if (window.YT && window.YT.Player) {
      const playerIframe = document.getElementById("youtube-player");

      ytPlayer = new YT.Player(playerIframe, {
        events: {
          onReady: () => {
            setupCustomControls();
            ytPlayer.playVideo();
            const equalizer = document.getElementById("music-equalizer");
            if (equalizer && !equalizer.querySelector("svg")) {
              const lottieAnimation = Lottie.loadAnimation({
                container: equalizer,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: "/src/assets/animations/animation-sound.json",
              });

              window.lottieEqualizer = lottieAnimation;

              lottieAnimation.addEventListener("DOMLoaded", () => {
                console.log("✅ Animación Lottie cargada");
              });

              const playBtn = document.getElementById("btn-play");
              const pauseBtn = document.getElementById("btn-pause");

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
                const equalizer = document.getElementById("music-equalizer");
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

  const setupCustomControls = () => {
    const playBtn = document.getElementById("btn-play");
    const pauseBtn = document.getElementById("btn-pause");
    const nextBtn = document.getElementById("btn-next");
    const prevBtn = document.getElementById("btn-prev");
    const progressBar = document.getElementById("progress-bar");
    const equalizer = document.getElementById("music-equalizer");

    playBtn?.addEventListener("click", () => {
      ytPlayer.playVideo();
      equalizer?.classList.remove("d-none");
    });

    pauseBtn?.addEventListener("click", () => {
      ytPlayer.pauseVideo();
      equalizer?.classList.add("d-none");
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
    const volumeControl = document.getElementById("volume-control");
    if (volumeControl) {
      // Inicializa el volumen en 100 al cargar
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
  };

  const overlay = document.querySelector(".overlay-blocker");

setTimeout(() => {
  if (overlay) {
    overlay.classList.add("fade-out");
  }
}, 8000); // 8 segundos

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  const userDataRaw = localStorage.getItem("userJearCastaInfo");
  let apiKey = null;

  if (userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      apiKey = userData[0]?.apikeyYoutube || null;
    } catch (error) {
      console.error("Error parsing userJearCastaInfo:", error);
    }
  }

  const searchForm = document.querySelector("form[role='search']");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("youtube-results");
  const searchTitle = document.getElementById("search-title");
  const playerContainer = document.getElementById("player-container");

  const renderPlayer = (video, index) => {
    currentVideoIndex = index;

    playerContainer.innerHTML = `
  <div class="card-body">
    <h6 class="card-title text-center mb-3" style="font-size: 1.2rem; font-weight: 600;">
      ${video.title}
    </h6>

    <div class="d-flex flex-column flex-md-row align-items-start gap-4">
      <div class="video-wrapper flex-shrink-0" style="flex: 1;">
        <iframe
          id="youtube-player"
          src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&enablejsapi=1&controls=0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
        <div class="overlay-blocker"></div>
      </div>

      <div class="d-flex flex-column align-items-center justify-content-between flex-grow-1 text-center">
        <div id="music-equalizer" style="width: 200px; max-width: 100%;"></div>
        <div id="progress-bar-container" class="mt-3"></div>
        <input
          id="progress-bar"
          type="range"
          min="0"
          max="100"
          value="0"
          step="1"
          class="form-range w-100 mb-3"
          style="max-width: 300px;"
        />

        <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2">
          <!-- Controles de reproducción -->
          <div class="d-flex gap-3 align-items-center">
            <button id="btn-prev" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-start-fill fs-4"></i>
            </button>
            <button id="btn-play" class="btn btn-outline-light btn-sm">
              <i class="bi bi-play-fill fs-4"></i>
            </button>
            <button id="btn-pause" class="btn btn-outline-light btn-sm">
              <i class="bi bi-pause-fill fs-4"></i>
            </button>
            <button id="btn-next" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-end-fill fs-4"></i>
            </button>
          </div>

          <!-- Control de volumen como ícono + slider oculto -->
          <div class="volume-wrapper">
            <i class="bi bi-volume-up volume-icon"></i>
            <input
              type="range"
              id="volume-control"
              min="0"
              max="100"
              value="100"
              step="1"
              class="form-range volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
`;


    waitForYT();
    setupCustomControls();
  };

  if (!searchForm || !searchInput || !resultsContainer || !searchTitle) return;

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query || !apiKey) return;

    searchTitle.classList.remove("d-none");
    searchTitle.textContent = `Resultados para: "${query}"`;

    const videos = await searchYoutube(query, apiKey);
    const videoIds = videos.map((v) => v.videoId).join(",");
    const stats = await getVideoStats(videoIds, apiKey);

    currentVideos = videos;
    localStorage.setItem("lastYoutubeResults", JSON.stringify(videos));

    resultsContainer.innerHTML = "";
    playerContainer.innerHTML = "";

    videos.forEach((video, index) => {
      const stat = stats.find((s) => s.videoId === video.videoId);
      const views = stat?.viewCount || "0";

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-6 col-xl-3 mb-3";

      const card = document.createElement("div");
      card.className =
        "card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom";

      card.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" 
             style="width: 120px; height: 80px; object-fit: cover;" 
             class="rounded-start me-3" />

        <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
          <div>
            <h6 class="card-title text-truncate mb-1" title="${
              video.title
            }" style="font-size: 0.85rem;">
              ${video.title}
            </h6>
            <p class="text-light small mb-2">
              <i class="bi bi-eye"></i> ${parseInt(
                views
              ).toLocaleString()} vistas
            </p>
          </div>

          <div class="d-flex justify-content-start gap-2">
            <button class="btn btn-sm play-btn" 
              data-video-id="${video.videoId}" 
              data-title="${video.title}" 
              data-thumbnail="${video.thumbnail}" 
              data-index="${index}">
              <i class="bi bi-play-circle"></i>
            </button>
            <button class="btn btn-sm favorite-btn" title="Agregar a favoritos" 
              data-video-id="${video.videoId}" 
              data-title="${video.title}" 
              data-thumbnail="${video.thumbnail}">
              <i class="bi bi-heart"></i>
            </button>
            <button class="btn btn-sm playlist-btn" title="Agregar a mi playlist" 
              data-video-id="${video.videoId}" 
              data-title="${video.title}" 
              data-thumbnail="${video.thumbnail}">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      `;

      col.appendChild(card);
      resultsContainer.appendChild(col);
    });

    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index, 10);
        renderPlayer(currentVideos[index], index);
      });
    });
  });

  document.body.addEventListener("click", async (e) => {
    const target = e.target.closest(".favorite-btn");
    if (!target) return;

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

    const user = JSON.parse(userDataRaw)[0];
    const userId = user?.id;
    if (!userId) return;

    const videoId = target.getAttribute("data-video-id");
    const title = target.getAttribute("data-title");
    const thumbnail = target.getAttribute("data-thumbnail");

    try {
      await addFavoriteMusic({
        user_id: userId,
        video_id: videoId,
        video_title: title,
        video_thumbnail: thumbnail,
      });

      Toastify({
        text: "Agregado a favoritos",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#198754",
      }).showToast();
    } catch (error) {
      const message = error.message.includes("already exists")
        ? "Este video ya está en tus favoritos"
        : "Error: " + error.message;

      Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#dc3545",
      }).showToast();
    }
  });

  const lastResultsRaw = localStorage.getItem("lastYoutubeResults");
  if (
    lastResultsRaw &&
    searchInput &&
    apiKey &&
    !sessionStorage.getItem("restoredOnce")
  ) {
    const lastVideos = JSON.parse(lastResultsRaw);
    searchInput.value = "";
    currentVideos = lastVideos;

    sessionStorage.setItem("restoredOnce", "true");
    const dummyForm = new Event("submit");
    searchForm.dispatchEvent(dummyForm);
  }
});
