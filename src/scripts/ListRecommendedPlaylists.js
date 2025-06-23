import { fetchRecommendedPlaylists } from "../domain/usecase/GetRecommendedPlaylists";
import { fetchSongsFromRecommendedPlaylist } from "../domain/usecase/GetSongsFromRecommendedPlaylist";
import Lottie from "lottie-web";

let ytPlayer;
let currentVideoIndex = 0;
let currentVideos = [];

function waitForYT() {
  if (window.YT && window.YT.Player) {
    const playerIframe = document.getElementById("youtube-player-recommended");
    if (!playerIframe) return;

    ytPlayer = new YT.Player(playerIframe, {
      events: {
        onReady: () => {
          setupCustomControls();
          ytPlayer.playVideo();

          const equalizer = document.getElementById("music-equalizer-recommended");
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
              const equalizer = document.getElementById("music-equalizer-recommended");
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
  const playBtn = document.getElementById("btn-play-recommended");
  const pauseBtn = document.getElementById("btn-pause-recommended");
  const nextBtn = document.getElementById("btn-next-recommended");
  const prevBtn = document.getElementById("btn-prev-recommended");
  const progressBar = document.getElementById("progress-bar-recommended");
  const equalizer = document.getElementById("music-equalizer-recommended");
  const overlay = document.getElementById("overlay-blocker-recommended");

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

    overlay?.classList.add("transparent");
  });

  pauseBtn?.addEventListener("click", () => {
    ytPlayer.pauseVideo();
    isPaused = true;
    equalizer?.classList.add("d-none");
    window.lottieEqualizer?.stop();

    overlay?.classList.remove("transparent");
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

  const volumeControl = document.getElementById("volume-control-recommended");
  if (volumeControl) {
    if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(100);
    volumeControl.addEventListener("input", () => {
      const volumeValue = parseInt(volumeControl.value, 10);
      ytPlayer.setVolume(volumeValue);
    });
  }
}

function renderPlayer(video, index) {
  currentVideoIndex = index;

  const playerContainer = document.getElementById("player-recommended-container");
  playerContainer.innerHTML = `
    <div class="d-flex player-layout-wrapper">
      <div class="video-wrapper-half">
        <iframe
          id="youtube-player-recommended"
          src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&enablejsapi=1&controls=0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
        <div class="overlay-blocker" id="overlay-blocker-recommended"></div>
      </div>
      <div class="player-controls-half d-flex flex-column align-items-center justify-content-between text-center">
        <h6 class="mb-2 player-title-recommended">${video.title}</h6>
        <div id="music-equalizer-recommended" style="width: 200px; max-width: 100%;"></div>
        <input id="progress-bar-recommended" type="range" min="0" max="100" value="0" step="1" class="form-range w-100" />
        <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2 mt-3">
          <div class="d-flex gap-3 align-items-center">
            <button id="btn-prev-recommended" class="btn btn-outline-light btn-sm"><i class="bi bi-skip-start-fill fs-4"></i></button>
            <button id="btn-play-recommended" class="btn btn-outline-light btn-sm"><i class="bi bi-play-fill fs-4"></i></button>
            <button id="btn-pause-recommended" class="btn btn-outline-light btn-sm"><i class="bi bi-pause-fill fs-4"></i></button>
            <button id="btn-next-recommended" class="btn btn-outline-light btn-sm"><i class="bi bi-skip-end-fill fs-4"></i></button>
          </div>
          <div class="volume-wrapper">
            <i class="bi bi-volume-up volume-icon"></i>
            <input type="range" id="volume-control-recommended" min="0" max="100" value="100" step="1" class="volume-slider" />
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => waitForYT(), 100);
}

document.addEventListener("DOMContentLoaded", async () => {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  const playlistContainer = document.getElementById("recommendedPlaylistContainer");
  const songsContainer = document.getElementById("recommendedSongsContainer");
  playlistContainer.innerHTML = "";

  const playlists = await fetchRecommendedPlaylists();
  const scrollWrapper = document.createElement("div");
  scrollWrapper.className = "d-flex overflow-auto gap-2 mb-4";

  playlists.forEach((playlist) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-light flex-shrink-0";
    btn.textContent = playlist.name.replaceAll("_", " ").trim();
    btn.style.minWidth = "200px";

    btn.addEventListener("click", async () => {
      const songs = await fetchSongsFromRecommendedPlaylist(playlist.id);
      songsContainer.innerHTML = "";

      if (songs.length === 0) {
        songsContainer.innerHTML = `<div class='text-white'>No hay canciones en esta playlist recomendada.</div>`;
        return;
      }

      currentVideos = songs.map((s) => ({
        videoId: s.video_id,
        title: s.video_title,
        thumbnail: s.video_thumbnail,
      }));

      songs.forEach((song) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-xl-3 mb-3";
        col.innerHTML = `
          <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
            <img src="${song.video_thumbnail}" alt="${song.video_title}" style="width: 120px; height: 80px; object-fit: cover;" class="rounded-start me-3" />
            <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
              <h6 class="card-title text-truncate mb-1" title="${song.video_title}" style="font-size: 0.85rem;">${song.video_title}</h6>
              <div class="d-flex justify-content-center align-items-center mt-2">
                <button class="btn btn-sm btn-outline-danger play-playlist-btn" data-video-id="${song.video_id}">
                  <i class="bi bi-play-circle"></i>
               </button>
              </div>
            </div>
          </div>
        `;
        songsContainer.appendChild(col);
      });

      document.querySelectorAll(".play-playlist-btn").forEach((btn) => {
        btn.onclick = () => {
          const videoId = btn.getAttribute("data-video-id");
          const index = currentVideos.findIndex((v) => v.videoId === videoId);
          if (index !== -1) renderPlayer(currentVideos[index], index);
        };
      });
    });

    scrollWrapper.appendChild(btn);
  });

  playlistContainer.appendChild(scrollWrapper);
});