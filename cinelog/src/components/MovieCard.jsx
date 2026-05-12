import { Link } from 'react-router-dom'
import { useUserList } from '../hooks/useUserList'
import { IMG_W300 } from '../services/tmdb'
import './MovieCard.css'

export default function MovieCard({ movie, style }) {
  const { movieStatus } = useUserList()
  const status = movieStatus(movie.id)

  const poster = movie.poster_path
    ? `${IMG_W300}${movie.poster_path}`
    : null

  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

  return (
    <Link to={`/pelicula/${movie.id}`} className="movie-card fade-up" style={style}>
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="card-no-poster">🎞️</div>
        )}

        {/* Overlay rating */}
        {rating && (
          <div className="card-rating">
            <span className="star-icon">★</span> {rating}
          </div>
        )}

        {/* Status indicators */}
        <div className="card-status-badges">
          {status.watched  && <span className="status-dot watched"  title="Vista">✓</span>}
          {status.pending  && <span className="status-dot pending"  title="Pendiente">⏳</span>}
          {status.favorite && <span className="status-dot favorite" title="Favorita">♥</span>}
        </div>

        <div className="card-overlay">
          <span className="card-view-btn">Ver más</span>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <span className="card-year">{year}</span>
      </div>
    </Link>
  )
}
