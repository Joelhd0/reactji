import { NavLink, Link } from 'react-router-dom'
import { useUserList } from '../hooks/useUserList'
import './Navbar.css'

export default function Navbar() {
  const { watched, pending, favorites } = useUserList()
  const totalItems = watched.length + pending.length + favorites.length

  return (
    <header className="navbar">
      <div className="navbar-inner page">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CINE<em>LOG</em></span>
        </Link>

        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Inicio
          </NavLink>
          <NavLink to="/buscar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Explorar
          </NavLink>
          <NavLink to="/perfil" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Mi Perfil
            {totalItems > 0 && <span className="nav-count">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
