import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserList } from '../hooks/useUserList'
import { IMG_W300 } from '../services/tmdb'
import RatingModal from '../components/RatingModal'
import './Profile.css'

const TABS = [
  { id: 'watched',   label: '✓ Vistas',     icon: '🎬' },
  { id: 'pending',   label: '⏳ Pendientes', icon: '📋' },
  { id: 'favorites', label: '♥ Favoritas',  icon: '❤️' },
]

export default function Profile() {
  const {
    watched, pending, favorites,
    removeWatched, removePending, removeFavorite,
    stats,
  } = useUserList()

  const [activeTab, setActiveTab] = useState('watched')
  const [ratingMovie, setRatingMovie] = useState(null)

  const s = stats()

  const listMap = { watched, pending, favorites }
  const currentList = listMap[activeTab]

  const removeMap = {
    watched: removeWatched,
    pending: removePending,
    favorites: removeFavorite,
  }

  return (
    <div className="profile-page page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">🎭</div>
        <div>
          <h1 className="profile-name">Mi <span>Perfil</span></h1>
          <p className="profile-sub">Tu diario personal de cine</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card fade-up">
          <span className="stat-number">{s.totalWatched}</span>
          <span className="stat-label">Películas vistas</span>
        </div>
        <div className="stat-card fade-up" style={{ animationDelay: '0.05s' }}>
          <span className="stat-number">{s.totalPending}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="stat-number">{s.totalFavorites}</span>
          <span className="stat-label">Favoritas</span>
        </div>
        <div className="stat-card fade-up" style={{ animationDelay: '0.15s' }}>
          <span className="stat-number" style={{ color: 'var(--gold)' }}>
            {s.avgRating ?? '—'}
          </span>
          <span className="stat-label">Nota media</span>
          {s.avgRating && <span className="stat-sub">{s.ratedCount} puntuadas</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{listMap[tab.id].length}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="empty-state fade-in">
          <div className="icon">{TABS.find(t => t.id === activeTab)?.icon}</div>
          <h3>Lista vacía</h3>
          <p>
            {activeTab === 'watched' && 'Empieza a marcar películas como vistas.'}
            {activeTab === 'pending' && 'Añade películas que quieras ver.'}
            {activeTab === 'favorites' && 'Guarda tus películas favoritas.'}
          </p>
          <Link to="/buscar" className="btn btn-primary" style={{ marginTop: 20 }}>
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="profile-list">
          {currentList.map((movie, i) => (
            <div key={movie.id} className="profile-list-item fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <Link to={`/pelicula/${movie.id}`} className="list-item-poster">
                {movie.poster_path ? (
                  <img src={`${IMG_W300}${movie.poster_path}`} alt={movie.title} loading="lazy" />
                ) : (
                  <span className="list-no-poster">🎞️</span>
                )}
              </Link>

              <div className="list-item-info">
                <Link to={`/pelicula/${movie.id}`} className="list-item-title">{movie.title}</Link>

                {activeTab === 'watched' && (
                  <div className="list-item-rating">
                    {movie.rating ? (
                      <span className="badge badge-gold">★ {movie.rating}/10</span>
                    ) : (
                      <span className="badge badge-blue">Sin puntuar</span>
                    )}
                    {movie.review && (
                      <p className="list-item-review">"{movie.review}"</p>
                    )}
                  </div>
                )}

                <span className="list-item-date">
                  Añadida el {new Date(movie.addedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="list-item-actions">
                {activeTab === 'watched' && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setRatingMovie(movie)}
                    title="Puntuar"
                  >
                    ★ {movie.rating ? 'Editar nota' : 'Puntuar'}
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeMap[activeTab](movie.id)}
                  title="Quitar de la lista"
                >
                  ✕ Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {ratingMovie && (
        <RatingModal movie={ratingMovie} onClose={() => setRatingMovie(null)} />
      )}
    </div>
  )
}
