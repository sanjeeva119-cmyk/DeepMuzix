const SONG_DATA_URL = './data/songs.json';

async function fetchSongs() {
  const response = await fetch(SONG_DATA_URL);
  return response.json();
}

function getUnique(songs, key) {
  return [...new Set(songs.map((song) => song[key]))].sort();
}

function populateSelect(node, values) {
  node.innerHTML = '<option value="">All</option>' + values.map((value) => `<option>${value}</option>`).join('');
}

function renderSongs(list, target) {
  if (!list.length) {
    target.innerHTML = '<p>No songs found for current filters.</p>';
    return;
  }

  target.innerHTML = `<div class="grid">${list.map((song) => `
      <article class="card">
        <img class="thumb" src="${song.thumbnail}" alt="${song.title}" loading="lazy"/>
        <div class="card-content">
          <h3><a href="song.html?slug=${song.slug}">${song.title}</a></h3>
          <p class="meta">${song.movie} • ${song.singers.join(', ')} • ${song.year}</p>
          <span class="badge">${song.genre}</span>
        </div>
      </article>`).join('')}</div>`;
}

async function initLyricsPage() {
  const songs = await fetchSongs();
  const songList = document.querySelector('#lyricsList');
  const queryNode = document.querySelector('#query');
  const yearNode = document.querySelector('#year');
  const movieNode = document.querySelector('#movie');
  const singerNode = document.querySelector('#singer');
  const genreNode = document.querySelector('#genre');

  populateSelect(yearNode, getUnique(songs, 'year'));
  populateSelect(movieNode, getUnique(songs, 'movie'));
  populateSelect(genreNode, getUnique(songs, 'genre'));
  populateSelect(singerNode, [...new Set(songs.flatMap((song) => song.singers))].sort());

  const params = new URLSearchParams(window.location.search);
  queryNode.value = params.get('q') || '';

  function applyFilters() {
    const query = queryNode.value.trim().toLowerCase();
    const filtered = songs.filter((song) => {
      const matchQuery = !query || [song.title, song.movie, song.musicDirector, ...song.singers].join(' ').toLowerCase().includes(query);
      const matchYear = !yearNode.value || String(song.year) === yearNode.value;
      const matchMovie = !movieNode.value || song.movie === movieNode.value;
      const matchSinger = !singerNode.value || song.singers.includes(singerNode.value);
      const matchGenre = !genreNode.value || song.genre === genreNode.value;
      return matchQuery && matchYear && matchMovie && matchSinger && matchGenre;
    });
    renderSongs(filtered, songList);
  }

  [queryNode, yearNode, movieNode, singerNode, genreNode].forEach((node) => node.addEventListener('input', applyFilters));
  applyFilters();
}

document.addEventListener('DOMContentLoaded', initLyricsPage);
