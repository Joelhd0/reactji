# 🎬 CineLog — Tu Diario Personal de Películas

> Aplicación web para descubrir películas, llevar un registro de lo que has visto y gestionar tus listas de pendientes y favoritos.

## Capturas de pantalla

> *(Añadir capturas tras ejecutar en local)*

---

## Instalación y arranque en local

### Requisitos
- Node.js 18+
- Una API Key gratuita de [TMDB](https://www.themoviedb.org/settings/api)

### Pasos

```bash
# 1. Clona el repositorio
git clone <url-del-repo>
cd cinelog

# 2. Instala dependencias
npm install

# 3. Crea el fichero de entorno
cp .env.example .env

# 4. Edita .env y pega tu API Key de TMDB
#    VITE_TMDB_API_KEY=tu_api_key_aqui

# 5. Arranca el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
npm run preview
```

---

## Cómo obtener la API Key de TMDB

1. Regístrate en [themoviedb.org](https://www.themoviedb.org/signup)
2. Ve a **Perfil → Ajustes → API**
3. Solicita una API Key (tipo: Developer, uso: personal)
4. Copia el valor de **API Key (v3 auth)**
5. Pégalo en tu fichero `.env` como `VITE_TMDB_API_KEY=...`

> ⚠️ **Importante:** El fichero `.env` está en `.gitignore`. Nunca subas tu API Key al repositorio.

---

## Rutas de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con hero dinámico, cartelera, mejor valoradas y populares |
| `/buscar` | Catálogo con buscador en tiempo real y filtros por género, año y nota |
| `/pelicula/:id` | Detalle de película: sinopsis, reparto, géneros, duración y tráiler embebido |
| `/perfil` | Listas personales (vistas, pendientes, favoritas) y estadísticas del usuario |

---

## Decisiones técnicas

### Framework y herramientas
- **React 18** con componentes funcionales y hooks
- **Vite** como bundler (arranque ultrarrápido en desarrollo)
- **React Router v6** para la navegación SPA con 5 rutas

### Gestión de estado
- **Context API + useReducer** (`UserListContext`) para las listas del usuario
- **localStorage** para persistencia entre sesiones (listas, puntuaciones y reseñas)
- Estado local (`useState`) para UI efímera (modales, tabs, inputs)

### Hooks personalizados
- **`useMovies`** — carga películas paginadas desde la API (popular, now_playing, top_rated, search, discover) con debounce para búsquedas y scroll infinito mediante IntersectionObserver
- **`useUserList`** — interfaz de alto nivel sobre el contexto: helpers para añadir/quitar de listas, puntuar, calcular estadísticas

### API
- Todas las llamadas a TMDB centralizadas en `src/services/tmdb.js`
- La API Key nunca aparece en el código fuente; se inyecta vía variable de entorno Vite (`import.meta.env.VITE_TMDB_API_KEY`)
- Idioma configurado a `es-ES` en todas las peticiones

### Estilos
- **CSS puro** con variables CSS (no hay dependencias de UI externas)
- Tema cinematográfico oscuro con tipografía `Bebas Neue` + `DM Serif Display` + `DM Sans`
- Responsive con CSS Grid y `auto-fill minmax` sin breakpoints complejos

### Rendimiento
- Carga diferida de imágenes (`loading="lazy"`)
- Scroll infinito con `IntersectionObserver` (sin polling)
- Debounce de 400 ms en el buscador

---

## Ampliaciones implementadas

*(Ninguna por defecto; añadir aquí si se implementan extras del punto 7 del enunciado)*

---

## Estructura del proyecto

```
cinelog/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   ├── MovieCard.jsx / .css
│   │   ├── LoadMore.jsx / .css
│   │   └── RatingModal.jsx / .css
│   ├── pages/
│   │   ├── Home.jsx / .css
│   │   ├── Search.jsx / .css
│   │   ├── MovieDetail.jsx / .css
│   │   ├── Profile.jsx / .css
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── UserListContext.jsx
│   ├── hooks/
│   │   ├── useMovies.js
│   │   └── useUserList.js
│   ├── services/
│   │   └── tmdb.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env              ← No subir al repositorio
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Autoría

- **Autor:** *[Tu nombre aquí]*
- **Curso:** Desarrollo Web en Entorno Cliente – Ampliación · 2025-2026
- **Fecha de entrega:** *[Fecha indicada por el docente]*
