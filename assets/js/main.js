const SONG_DATA_URL = './data/songs.json';

async function fetchSongs() {
  const response = await fetch(SONG_DATA_URL);
  if (!response.ok) throw new Error('Unable to load songs');
  return response.json();
}

function songCard(song) {
  return `
    <article class="card">
      <img class="thumb" src="${song.thumbnail}" alt="${song.title} karaoke thumbnail" loading="lazy" />
      <div class="card-content">
        <h3><a href="song.html?slug=${song.slug}">${song.title}</a></h3>
        <p class="meta">${song.movie} • ${song.year}</p>
        <span class="badge">${song.genre}</span>
        <span class="badge">${song.category}</span>
      </div>
    </article>`;
}

function hydrateHome(songs) {
  const latestNode = document.querySelector('[data-latest]');
  const popularNode = document.querySelector('[data-popular]');
  const genreNode = document.querySelector('[data-genres]');

  if (latestNode) {
    const latest = [...songs]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 6);
    latestNode.innerHTML = latest.map(songCard).join('');
  }

  if (popularNode) {
    const popular = songs.filter((song) => song.isPopular).slice(0, 6);
    popularNode.innerHTML = popular.map(songCard).join('');
  }

  if (genreNode) {
    const genres = [...new Set(songs.map((song) => song.genre))];
    genreNode.innerHTML = genres
      .map((genre) => `<span class="badge">${genre}</span>`)
      .join('');
  }
}

async function initHomePage() {
  try {
    const songs = await fetchSongs();
    hydrateHome(songs);

    const searchInput = document.querySelector('#homeSearch');
    const searchButton = document.querySelector('#homeSearchBtn');
    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', () => {
      const query = encodeURIComponent(searchInput.value.trim());
      window.location.href = `lyrics.html?q=${query}`;
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', initHomePage);
