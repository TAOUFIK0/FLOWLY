/* ========================================
   Composant racine de l'application
   ======================================== */

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/common/Toast';

const PUBLIC_PATHS = ['/', '/features', '/how-it-works', '/login', '/register', '/solutions', '/pricing', '/resources'];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((path) => pathname === path);
}

export default function App() {
  const location = useLocation();
  const showNavbar = !isPublicPath(location.pathname);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <div className="app">
      <main>
        <AppRouter />
      </main>
      <ToastContainer />
    </div>
  );
}