import { createContext, useContext, useReducer, useEffect } from 'react'

const UserListContext = createContext(null)

const initialState = {
  watched: [],    // { id, title, poster_path, rating, review, addedAt }
  pending: [],    // { id, title, poster_path, addedAt }
  favorites: [],  // { id, title, poster_path, addedAt }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('cinelog_lists')
    return saved ? JSON.parse(saved) : initialState
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_WATCHED': {
      const exists = state.watched.some(m => m.id === action.movie.id)
      if (exists) return state
      return {
        ...state,
        watched: [...state.watched, { ...action.movie, rating: null, review: '', addedAt: Date.now() }],
      }
    }
    case 'REMOVE_WATCHED':
      return { ...state, watched: state.watched.filter(m => m.id !== action.id) }

    case 'RATE_MOVIE':
      return {
        ...state,
        watched: state.watched.map(m =>
          m.id === action.id ? { ...m, rating: action.rating, review: action.review ?? m.review } : m
        ),
      }

    case 'ADD_PENDING': {
      const exists = state.pending.some(m => m.id === action.movie.id)
      if (exists) return state
      return { ...state, pending: [...state.pending, { ...action.movie, addedAt: Date.now() }] }
    }
    case 'REMOVE_PENDING':
      return { ...state, pending: state.pending.filter(m => m.id !== action.id) }

    case 'ADD_FAVORITE': {
      const exists = state.favorites.some(m => m.id === action.movie.id)
      if (exists) return state
      return { ...state, favorites: [...state.favorites, { ...action.movie, addedAt: Date.now() }] }
    }
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(m => m.id !== action.id) }

    default:
      return state
  }
}

export function UserListProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadFromStorage)

  useEffect(() => {
    localStorage.setItem('cinelog_lists', JSON.stringify(state))
  }, [state])

  return (
    <UserListContext.Provider value={{ state, dispatch }}>
      {children}
    </UserListContext.Provider>
  )
}

export function useUserListContext() {
  const ctx = useContext(UserListContext)
  if (!ctx) throw new Error('useUserListContext must be used inside UserListProvider')
  return ctx
}
