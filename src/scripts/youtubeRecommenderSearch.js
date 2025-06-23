import { searchYoutube, getVideoStats } from "/src/data/youtube/searchYoutube";
import { fetchRecommendedPlaylists } from "../domain/usecase/GetRecommendedPlaylists";
import { addSongToRecommendedPlaylist } from "../domain/usecase/AddSongToRecommendedPlaylist";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", async () => {
  let currentVideos = [];

  const playerContainer = document.getElementById("player-container");
  const resultsContainer = document.getElementById("youtube-results");
  const searchForm = document.querySelector("form[role='search']");
  const searchInput = document.getElementById("search-input");
  const searchTitle = document.getElementById("search-title");

  // Modal UI elements
  const modal = document.getElementById("recommendModal");
  const modalList = document.getElementById("recommendPlaylistList");
  const modalInput = document.getElementById("recommendNameInput");
  const modalConfirm = document.getElementById("confirmAddRecommend");

  let recommendedPlaylists = [];

  async function loadRecommendedPlaylists() {
    recommendedPlaylists = await fetchRecommendedPlaylists();
    modalList.innerHTML = "";
    recommendedPlaylists.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-secondary m-1";
      btn.textContent = p.name;
      btn.onclick = () => {
        modalInput.value = p.name;
        highlightSelection(p.id);
      };
      btn.setAttribute("data-id", p.id);
      modalList.appendChild(btn);
    });
  }

  function highlightSelection(selectedId) {
    modalList.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-id") === selectedId);
    });
  }

  searchForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const q = searchInput.value.trim(); if (!q) return;
    const userRaw = localStorage.getItem("userJearCastaInfo");
    if (!userRaw) return;
    const apiKey = JSON.parse(userRaw)[0]?.apikeyYoutube; if (!apiKey) return;

    searchTitle.textContent = `Resultados: "${q}"`;
    searchTitle.classList.remove("d-none");

    const videos = await searchYoutube(q, apiKey);
    const stats = await getVideoStats(videos.map(v => v.videoId).join(","), apiKey);
    currentVideos = videos;

    resultsContainer.innerHTML = "";
    playerContainer.innerHTML = "";

    videos.forEach((v, i) => {
      const view = stats.find(s => s.videoId === v.videoId)?.viewCount || "0";
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4 mb-3";

      col.innerHTML = `
        <div class="card shadow-sm p-2">
          <img src="${v.thumbnail}" alt="${v.title}" class="card-img-top" style="height:140px;object-fit:cover">
          <div class="card-body p-2">
            <h6 class="card-title text-truncate">${v.title}</h6>
            <p class="text-muted small"><i class="bi bi-eye"></i> ${parseInt(view).toLocaleString()}</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary play-btn" data-index="${i}">
                <i class="bi bi-play-fill"></i>
              </button>
              <button class="btn btn-sm btn-outline-success add-btn" data-index="${i}">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>`;
      resultsContainer.appendChild(col);
    });

    document.querySelectorAll(".play-btn").forEach(btn => {
      btn.onclick = () => {
        const i = btn.dataset.index;
        renderPlayer(currentVideos[i].videoId);
      };
    });

    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.onclick = async () => {
        await loadRecommendedPlaylists();
        const idx = btn.dataset.index;
        modalConfirm.dataset.index = idx;
        new bootstrap.Modal(modal).show();
      };
    });
  });

  modalConfirm.onclick = async () => {
    const idx = modalConfirm.dataset.index;
    const video = currentVideos[idx];
    const name = modalInput.value.trim();

    if (!name) {
      return Toastify({
        text: "Ingresa el nombre de la playlist",
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
    }

    const playlistId = name.toLowerCase().replace(/\s+/g, "_");

    try {
      await addSongToRecommendedPlaylist(
        playlistId,
        {
          video_id: video.videoId,
          video_title: video.title,
          video_thumbnail: video.thumbnail,
        },
        name // <-- pasasara el nombre solo si es nuevo
      );

      Toastify({
        text: `Agregado a playlist "${name}"`,
        duration: 3000,
        backgroundColor: "#198754",
      }).showToast();

      bootstrap.Modal.getInstance(modal).hide();
    } catch (err) {
      Toastify({
        text: "Error: " + err.message,
        duration: 3000,
        backgroundColor: "#dc3545"
      }).showToast();
    }
  };

  function renderPlayer(videoId) {
    playerContainer.innerHTML = `<iframe width="100%" height="280"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
    </iframe>`;
  }
});
