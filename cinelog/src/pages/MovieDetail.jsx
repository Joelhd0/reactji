import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tmdb, IMG_ORIGINAL, IMG_W500, IMG_W300 } from '../services/tmdb'
import { useUserList } from '../hooks/useUserList'
import RatingModal from '../components/RatingModal'
import MovieCard from '../components/MovieCard'
import './MovieDetail.css'

function formatRuntime(mins) {
  if (!mins) return null
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  const {
    movieStatus, getWatchedEntry,
    addWatched, removeWatched,
    addPending, removePending,
    addFavorite, removeFavorite,
  } = useUserList()

  useEffect(() => {
    setLoading(true)
    setError(null)
    setMovie(null)
    window.scrollTo(0, 0)
    tmdb.getMovie(id)
      .then(data => {
        setMovie(data)
        const trailer = data.videos?.results?.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        ) ?? data.videos?.results?.[0]
        setTrailerKey(trailer?.key ?? null)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner" />
    </div>
  )

  if (error) return (
    <div className="page" style={{ paddingTop: 60 }}>
      <p className="error-msg">{error}</p>
      <Link to="/" className="btn btn-ghost" style={{ marginTop: 16 }}>← Volver</Link>
    </div>
  )

  if (!movie) return null

  const status = movieStatus(movie.id)
  const entry = getWatchedEntry(movie.id)
  const mini = { id: movie.id, title: movie.title, poster_path: movie.poster_path }

  const backdropUrl = movie.backdrop_path ? `${IMG_ORIGINAL}${movie.backdrop_path}` : null
  const posterUrl = movie.poster_path ? `${IMG_W500}${movie.poster_path}` : null

  const director = movie.credits?.crew?.find(c => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 8) ?? []
  const similar = movie.similar?.results?.slice(0, 6) ?? []

  return (
    <div className="detail-page">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="detail-backdrop" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="detail-backdrop-gradient" />
        </div>
      )}

      <div className="detail-content page">
        <div className="detail-main">
          {/* Poster */}
          <div className="detail-poster fade-up">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} />
            ) : (
              <div className="detail-no-poster">🎞️</div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="detail-meta-row">
              {movie.release_date && <span className="badge badge-blue">{movie.release_date.slice(0,4)}</span>}
              {movie.vote_average > 0 && <span className="badge badge-gold">★ {movie.vote_average.toFixed(1)}</span>}
              {formatRuntime(movie.runtime) && <span className="badge badge-blue">⏱ {formatRuntime(movie.runtime)}</span>}
              {status.watched && entry?.rating && <span className="badge badge-green">Mi nota: {entry.rating}/10</span>}
            </div>

            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="detail-genres">
                {movie.genres.map(g => <span key={g.id} className="tag">{g.name}</span>)}
              </div>
            )}

            {director && (
              <p className="detail-director">
                <span className="label">Dirección</span>
                <strong>{director.name}</strong>
              </p>
            )}

            {movie.overview && (
              <p className="detail-overview">{movie.overview}</p>
            )}

            {/* Action buttons */}
            <div className="detail-actions">
              <button
                className={`btn ${status.watched ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => status.watched ? removeWatched(movie.id) : (addWatched(mini), setShowRating(true))}
              >
                {status.watched ? '✕ Quitar de vistas' : '✓ Marcar como vista'}
              </button>

              {status.watched && (
                <button className="btn btn-ghost" onClick={() => setShowRating(true)}>
                  ★ {entry?.rating ? `Mi nota: ${entry.rating}` : 'Puntuar'}
                </button>
              )}

              <button
                className={`btn btn-ghost ${status.pending ? 'active-list' : ''}`}
                onClick={() => status.pending ? removePending(movie.id) : addPending(mini)}
              >
                {status.pending ? '⏳ En pendientes' : '+ Pendiente'}
              </button>

              <button
                className={`btn btn-ghost ${status.favorite ? 'active-list' : ''}`}
                onClick={() => status.favorite ? removeFavorite(movie.id) : addFavorite(mini)}
              >
                {status.favorite ? '♥ En favoritas' : '♡ Favorita'}
              </button>
            </div>

            {/* User review */}
            {status.watched && entry?.review && (
              <div className="detail-review">
                <span className="label">Mi reseña</span>
                <p>"{entry.review}"</p>
              </div>
            )}

            {/* Trailer button */}
            {trailerKey && (
              <button className="btn btn-ghost detail-trailer-btn" onClick={() => setShowTrailer(true)}>
                ▶ Ver tráiler
              </button>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title" style={{ fontSize: 24 }}>Reparto <span>principal</span></h2>
            <div className="cast-grid">
              {cast.map(actor => (
                <div key={actor.id} className="cast-card">
                  <div className="cast-photo">
                    {actor.profile_path
                      ? <img src={`${IMG_W300}${actor.profile_path}`} alt={actor.name} loading="lazy" />
                      : <span>👤</span>
                    }
                  </div>
                  <p className="cast-name">{actor.name}</p>
                  <p className="cast-character">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title" style={{ fontSize: 24 }}>Películas <span>similares</span></h2>
            <div className="similar-grid">
              {similar.map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
          </section>
        )}
      </div>

      {/* Rating modal */}
      {showRating && (
        <RatingModal movie={movie} onClose={() => setShowRating(false)} />
      )}

      {/* Trailer modal */}
      {showTrailer && trailerKey && (
        <div className="trailer-backdrop" onClick={() => setShowTrailer(false)}>
          <div className="trailer-wrap" onClick={e => e.stopPropagation()}>
            <button className="modal-close trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Tráiler"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
