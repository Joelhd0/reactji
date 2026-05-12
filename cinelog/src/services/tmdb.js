const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const LANGUAGE = 'es-ES'

export const IMG_BASE = 'https://image.tmdb.org/t/p'
export const IMG_W500 = `${IMG_BASE}/w500`
export const IMG_ORIGINAL = `${IMG_BASE}/original`
export const IMG_W300 = `${IMG_BASE}/w300`

async function apiFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', LANGUAGE)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`)
  return res.json()
}

export const tmdb = {
  getPopular: (page = 1) => apiFetch('/movie/popular', { page }),
  getNowPlaying: (page = 1) => apiFetch('/movie/now_playing', { page }),
  getTopRated: (page = 1) => apiFetch('/movie/top_rated', { page }),
  getUpcoming: (page = 1) => apiFetch('/movie/upcoming', { page }),
  getMovie: (id) => apiFetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }),
  searchMovies: (query, page = 1) => apiFetch('/search/movie', { query, page }),
  discoverMovies: (params) => apiFetch('/discover/movie', params),
  getGenres: () => apiFetch('/genre/movie/list'),
  getTrending: () => apiFetch('/trending/movie/week'),
}
