import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tmdb, IMG_ORIGINAL, IMG_W500 } from '../services/tmdb'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/MovieCard'
import LoadMore from '../components/LoadMore'
import './Home.css'

export default function Home() {
  const [hero, setHero] = useState(null)
  const [heroIdx, setHeroIdx] = useState(0)
  const [trending, setTrending] = useState([])

  const { movies: popular, loading: loadingPop, error: errorPop, loadMore, hasMore } = useMovies({ type: 'popular' })
  const { movies: nowPlaying } = useMovies({ type: 'now_playing' })
  const { movies: topRated } = useMovies({ type: 'top_rated' })

  useEffect(() => {
    tmdb.getTrending().then(d => {
      setTrending(d.results.slice(0, 6))
      setHero(d.results[0])
    }).catch(() => {})
  }, [])

  // Cycle hero every 7s
  useEffect(() => {
    if (!trending.length) return
    const t = setInterval(() => {
      setHeroIdx(i => {
        const next = (i + 1) % trending.length
        setHero(trending[next])
        return next
      })
    }, 7000)
    return () => clearInterval(t)
  }, [trending])

  const backdropUrl = hero?.backdrop_path ? `${IMG_ORIGINAL}${hero.backdrop_path}` : null

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero" style={{ '--backdrop': backdropUrl ? `url(${backdropUrl})` : 'none' }}>
        <div className="hero-gradient" />
        {hero && (
          <div className="hero-content page fade-in">
            <div className="hero-meta">
              <span className="badge badge-gold">★ {hero.vote_average?.toFixed(1)}</span>
              <span className="badge badge-blue">{hero.release_date?.slice(0,4)}</span>
            </div>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-overview">{hero.overview?.slice(0, 200)}{hero.overview?.length > 200 ? '…' : ''}</p>
            <div className="hero-actions">
              <Link to={`/pelicula/${hero.id}`} className="btn btn-primary">
                Ver detalles
              </Link>
              <Link to="/buscar" className="btn btn-ghost">
                Explorar catálogo
              </Link>
            </div>
            {/* Dots */}
            <div className="hero-dots">
              {trending.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot ${i === heroIdx ? 'active' : ''}`}
                  onClick={() => { setHeroIdx(i); setHero(trending[i]) }}
                  aria-label={`Slide ${i+1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* En Cartelera */}
      {nowPlaying.length > 0 && (
        <section className="home-section page">
          <div className="section-header">
            <h2 className="section-title">En <span>Cartelera</span></h2>
            <Link to="/buscar?tipo=now_playing" className="section-more">Ver todo →</Link>
          </div>
          <div className="home-row-scroll">
            {nowPlaying.slice(0, 12).map((m, i) => (
              <MovieCard key={m.id} movie={m} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        </section>
      )}

      {/* Mejor Valoradas */}
      {topRated.length > 0 && (
        <section className="home-section page">
          <div className="section-header">
            <h2 className="section-title">Mejor <span>Valoradas</span></h2>
            <Link to="/buscar?tipo=top_rated" className="section-more">Ver todo →</Link>
          </div>
          <div className="home-row-scroll">
            {topRated.slice(0, 12).map((m, i) => (
              <MovieCard key={m.id} movie={m} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        </section>
      )}

      {/* Populares con scroll infinito */}
      <section className="home-section page">
        <div className="section-header">
          <h2 className="section-title">Películas <span>Populares</span></h2>
        </div>
        {errorPop && <p className="error-msg">{errorPop}</p>}
        {!errorPop && (
          <>
            <div className="movie-grid">
              {popular.map((m, i) => (
                <MovieCard key={m.id} movie={m} style={{ animationDelay: `${(i % 20) * 0.04}s` }} />
              ))}
              {loadingPop && !popular.length && Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card-skeleton skeleton" />
              ))}
            </div>
            <LoadMore onLoadMore={loadMore} hasMore={hasMore} loading={loadingPop} />
          </>
        )}
      </section>
    </div>
  )
}
