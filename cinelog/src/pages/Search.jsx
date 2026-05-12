import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tmdb } from '../services/tmdb'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/MovieCard'
import LoadMore from '../components/LoadMore'
import './Search.css'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Más populares' },
  { value: 'vote_average.desc', label: 'Mejor valoradas' },
  { value: 'release_date.desc', label: 'Más recientes' },
  { value: 'revenue.desc', label: 'Más taquilleras' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i)

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genero') || '')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('anio') || '')
  const [minRating, setMinRating] = useState(searchParams.get('nota') || '')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [tipoInicial] = useState(searchParams.get('tipo') || 'popular')

  // Determine mode
  const isSearch = query.trim().length > 0
  const isDiscover = !isSearch && (selectedGenre || selectedYear || minRating)

  const movieParams = isSearch
    ? { type: 'search', query }
    : isDiscover
      ? {
          type: 'discover',
          filters: {
            sort_by: sortBy,
            ...(selectedGenre && { with_genres: selectedGenre }),
            ...(selectedYear && { primary_release_year: selectedYear }),
            ...(minRating && { 'vote_average.gte': minRating }),
            'vote_count.gte': 100,
          },
        }
      : { type: tipoInicial }

  const { movies, loading, error, loadMore, hasMore } = useMovies(movieParams)

  useEffect(() => {
    tmdb.getGenres().then(d => setGenres(d.genres)).catch(() => {})
  }, [])

  const clearFilters = () => {
    setQuery('')
    setSelectedGenre('')
    setSelectedYear('')
    setMinRating('')
    setSortBy('popularity.desc')
  }

  const hasFilters = query || selectedGenre || selectedYear || minRating

  return (
    <div className="search-page page">
      <h1 className="section-title search-heading">
        Explorar <span>Catálogo</span>
      </h1>

      {/* Search bar */}
      <div className="search-bar-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="input search-input"
          type="search"
          placeholder="Buscar película por título..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <select
          className="input filter-select"
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        <select
          className="input filter-select"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
        >
          <option value="">Cualquier año</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          className="input filter-select"
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
        >
          <option value="">Cualquier nota</option>
          {[9,8,7,6,5].map(n => (
            <option key={n} value={n}>Nota mínima {n}</option>
          ))}
        </select>

        {!isSearch && (
          <select
            className="input filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}

        {hasFilters && (
          <button className="btn btn-ghost filter-clear" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results */}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <div className="icon">🎞️</div>
          <h3>Sin resultados</h3>
          <p>Prueba con otros términos o ajusta los filtros.</p>
        </div>
      )}

      <div className="movie-grid search-grid">
        {movies.map((m, i) => (
          <MovieCard key={m.id} movie={m} style={{ animationDelay: `${(i % 20) * 0.03}s` }} />
        ))}
        {loading && movies.length === 0 && Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="card-skeleton skeleton" style={{ aspectRatio: '2/3' }} />
        ))}
      </div>

      <LoadMore onLoadMore={loadMore} hasMore={hasMore} loading={loading && movies.length > 0} />
    </div>
  )
}
