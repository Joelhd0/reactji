import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎬</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, letterSpacing: '0.05em', color: 'var(--gold)' }}>
        404
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: 32, fontSize: 16 }}>
        Esta página no existe. Quizás buscas otra película.
      </p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}
