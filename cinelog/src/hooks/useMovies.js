import { useState, useEffect, useCallback, useRef } from 'react'
import { tmdb } from '../services/tmdb'

/**
 * useMovies — hook personalizado para cargar listas de películas paginadas.
 * Soporta: popular, now_playing, top_rated, upcoming, search, discover.
 */
export function useMovies({ type = 'popular', query = '', filters = {} } = {}) {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const fetchMovies = useCallback(async (currentPage, append = false) => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (type === 'search' && query.trim()) {
        data = await tmdb.searchMovies(query.trim(), currentPage)
      } else if (type === 'discover') {
        data = await tmdb.discoverMovies({ ...filters, page: currentPage })
      } else if (type === 'now_playing') {
        data = await tmdb.getNowPlaying(currentPage)
      } else if (type === 'top_rated') {
        data = await tmdb.getTopRated(currentPage)
      } else if (type === 'upcoming') {
        data = await tmdb.getUpcoming(currentPage)
      } else {
        data = await tmdb.getPopular(currentPage)
      }
      setTotalPages(data.total_pages)
      setMovies(prev => append ? [...prev, ...data.results] : data.results)
    } catch (err) {
      setError(err.message || 'Error al cargar películas')
    } finally {
      setLoading(false)
    }
  }, [type, query, JSON.stringify(filters)])

  // Reset y refetch cuando cambian los parámetros (con debounce para búsquedas)
  useEffect(() => {
    setPage(1)
    setMovies([])
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchMovies(1, false), type === 'search' ? 400 : 0)
    return () => clearTimeout(debounceRef.current)
  }, [fetchMovies])

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchMovies(nextPage, true)
    }
  }, [page, totalPages, loading, fetchMovies])

  const hasMore = page < totalPages

  return { movies, loading, error, loadMore, hasMore, page, totalPages }
}
