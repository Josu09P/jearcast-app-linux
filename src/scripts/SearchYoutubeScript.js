import { searchYoutube, getVideoStats } from "/src/data/youtube/searchYoutube";

document.addEventListener("DOMContentLoaded", () => {
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
  const playerContainer = document.createElement("div");
  playerContainer.id = "player-container";
  playerContainer.className = "bg-dark text-white p-4 rounded shadow mt-4";
  resultsContainer.insertAdjacentElement("afterend", playerContainer);

  let currentVideoIndex = 0;
  let currentVideos = [];

  const renderPlayer = (video, index) => {
    currentVideoIndex = index;

    playerContainer.innerHTML = `
      <div class="d-flex flex-column align-items-start">
        <h5>${video.title}</h5>
        <iframe
          id="youtube-player"
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&enablejsapi=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
        <button class="btn btn-outline-light mt-3" id="back-to-search">Volver a resultados</button>
      </div>
    `;

    // ⏭ Reproducir siguiente al terminar
    setTimeout(() => {
      const playerIframe = document.getElementById("youtube-player");
      const player = new YT.Player(playerIframe, {
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              const nextIndex = currentVideoIndex + 1;
              if (nextIndex < currentVideos.length) {
                renderPlayer(currentVideos[nextIndex], nextIndex);
              }
            }
          },
        },
      });
    }, 1000);

    // 🔙 Volver
    document.getElementById("back-to-search").addEventListener("click", () => {
      playerContainer.innerHTML = "";
      resultsContainer.classList.remove("d-none");
      searchTitle.classList.remove("d-none");
    });
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

    currentVideos = videos; // 💾 Guardamos lista actual
    localStorage.setItem("lastYoutubeResults", JSON.stringify(videos));

    resultsContainer.innerHTML = "";
    playerContainer.innerHTML = "";

    videos.forEach((video, index) => {
      const stat = stats.find((s) => s.videoId === video.videoId);
      const views = stat?.viewCount || "0";

      const col = document.createElement("div");
      col.className = "col-md-3";

      const card = document.createElement("div");
      card.className = "card h-100 shadow-sm";

      card.innerHTML = `
        <img src="${video.thumbnail}" class="card-img-top" alt="${video.title}" />
        <div class="card-body p-2">
          <h6 class="card-title text-truncate" title="${video.title}">${video.title}</h6>
          <p class="text-muted small mb-1"><i class="bi bi-eye"></i> ${parseInt(views).toLocaleString()} vistas</p>
          <button 
            class="btn btn-sm btn-outline-primary w-100 play-btn" 
            data-video-id="${video.videoId}" 
            data-title="${video.title}" 
            data-index="${index}">
            Reproducir
          </button>
        </div>
      `;
      col.appendChild(card);
      resultsContainer.appendChild(col);
    });

    // ▶️ Reproducir video estilo Spotify
    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index, 10);
        resultsContainer.classList.add("d-none");
        searchTitle.classList.add("d-none");
        renderPlayer(currentVideos[index], index);
      });
    });
  });

 // 📦 Restaurar resultados si están en localStorage
const lastResultsRaw = localStorage.getItem("lastYoutubeResults");
if (lastResultsRaw && searchInput && apiKey && !sessionStorage.getItem("restoredOnce")) {
  const lastVideos = JSON.parse(lastResultsRaw);
  searchInput.value = "";
  currentVideos = lastVideos;

  sessionStorage.setItem("restoredOnce", "true")
  const dummyForm = new Event("submit");
  searchForm.dispatchEvent(dummyForm);
}
});
