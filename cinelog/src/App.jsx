import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom'
import { UserListProvider } from './context/UserListContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetail from './pages/MovieDetail'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <UserListProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/buscar"         element={<Search />} />
            <Route path="/pelicula/:id"   element={<MovieDetail />} />
            <Route path="/perfil"         element={<Profile />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </main>
      </UserListProvider>
    </BrowserRouter>
  )
}
