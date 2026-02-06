const SONG_DATA_URL = './data/songs.json';

async function fetchSongs() {
  const response = await fetch(SONG_DATA_URL);
  return response.json();
}

function updateMeta(song) {
  document.title = `${song.title} Lyrics (Tamil & Thanglish) | DeepMuzix`;
  const description = `${song.title} from ${song.movie} (${song.year}) - Tamil and Thanglish lyrics with karaoke video.`;
  const setMeta = (selector, attr, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', document.title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[name="twitter:title"]', 'content', document.title);
  setMeta('meta[name="twitter:description"]', 'content', description);
}

function renderSong(song, songs) {
  document.querySelector('#songTitle').textContent = song.title;
  document.querySelector('#songMeta').textContent = `${song.movie} • ${song.singers.join(', ')} • ${song.musicDirector} • ${song.year}`;
  document.querySelector('#karaokeEmbed').src = `https://www.youtube.com/embed/${song.youtubeKaraokeId}?rel=0`;

  const lyricsBox = document.querySelector('#lyricsBox');
  const toggle = document.querySelector('#lyricToggle');
  let mode = 'tamil';

  function renderLyrics() {
    lyricsBox.textContent = mode === 'tamil' ? song.lyricsTamil : song.lyricsThanglish;
    toggle.textContent = mode === 'tamil' ? 'Switch to Thanglish' : 'தமிழுக்கு மாறு';
  }

  toggle.addEventListener('click', () => {
    mode = mode === 'tamil' ? 'thanglish' : 'tamil';
    renderLyrics();
  });

  renderLyrics();

  const related = songs.filter((item) => song.relatedSlugs.includes(item.slug));
  document.querySelector('#relatedSongs').innerHTML = related.map((item) =>
    `<li><a href="song.html?slug=${item.slug}">${item.title} (${item.movie})</a></li>`
  ).join('');

  updateMeta(song);
}

async function initSongPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const songs = await fetchSongs();
  const song = songs.find((item) => item.slug === slug) || songs[0];
  renderSong(song, songs);
}

document.addEventListener('DOMContentLoaded', initSongPage);
