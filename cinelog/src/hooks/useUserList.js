import { useUserListContext } from '../context/UserListContext'

/**
 * useUserList — hook personalizado para interactuar con las listas del usuario.
 * Expone helpers de alto nivel sobre el contexto.
 */
export function useUserList() {
  const { state, dispatch } = useUserListContext()

  const movieStatus = (id) => ({
    watched: state.watched.some(m => m.id === id),
    pending: state.pending.some(m => m.id === id),
    favorite: state.favorites.some(m => m.id === id),
  })

  const getWatchedEntry = (id) => state.watched.find(m => m.id === id) ?? null

  // Acciones
  const addWatched = (movie) => dispatch({ type: 'ADD_WATCHED', movie })
  const removeWatched = (id) => dispatch({ type: 'REMOVE_WATCHED', id })
  const rateMovie = (id, rating, review) => dispatch({ type: 'RATE_MOVIE', id, rating, review })

  const addPending = (movie) => dispatch({ type: 'ADD_PENDING', movie })
  const removePending = (id) => dispatch({ type: 'REMOVE_PENDING', id })

  const addFavorite = (movie) => dispatch({ type: 'ADD_FAVORITE', movie })
  const removeFavorite = (id) => dispatch({ type: 'REMOVE_FAVORITE', id })

  // Estadísticas para el perfil
  const stats = () => {
    const watched = state.watched
    const totalWatched = watched.length
    const rated = watched.filter(m => m.rating !== null)
    const avgRating = rated.length
      ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(1)
      : null

    return {
      totalWatched,
      totalPending: state.pending.length,
      totalFavorites: state.favorites.length,
      avgRating,
      ratedCount: rated.length,
    }
  }

  return {
    watched: state.watched,
    pending: state.pending,
    favorites: state.favorites,
    movieStatus,
    getWatchedEntry,
    addWatched,
    removeWatched,
    rateMovie,
    addPending,
    removePending,
    addFavorite,
    removeFavorite,
    stats,
  }
}
