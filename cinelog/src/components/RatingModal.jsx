import { useState, useEffect } from 'react'
import { useUserList } from '../hooks/useUserList'
import './RatingModal.css'

export default function RatingModal({ movie, onClose }) {
  const { rateMovie, getWatchedEntry } = useUserList()
  const entry = getWatchedEntry(movie.id)

  const [rating, setRating] = useState(entry?.rating ?? 0)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState(entry?.review ?? '')

  const handleSave = () => {
    rateMovie(movie.id, rating || null, review)
    onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-up">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <h2 className="modal-title">Puntuar película</h2>
        <p className="modal-movie-name">{movie.title}</p>

        <div className="modal-stars">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button
              key={n}
              className={`star ${n <= (hover || rating) ? 'filled' : ''}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} estrellas`}
            >
              ★
            </button>
          ))}
        </div>
        {(hover || rating) > 0 && (
          <p className="modal-rating-value">{hover || rating} / 10</p>
        )}

        <textarea
          className="input modal-review"
          placeholder="Escribe una reseña breve... (opcional)"
          value={review}
          onChange={e => setReview(e.target.value)}
          rows={3}
        />

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!rating}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
