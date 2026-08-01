/* ========================================
   Client HTTP — Instance Axios centralisée
   ======================================== */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

/* Routes qui ne doivent jamais recevoir de token
   (un token expiré/invalide y ferait planter des routes
   censées être accessibles sans authentification) */
const PUBLIC_ROUTES = ['/auth/register', '/auth/login'];

/* ── Intercepteur de requête ── */
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) => config.url?.includes(route));

    if (!isPublicRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Intercepteur de réponse ── */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[Axios] Aucune réponse du serveur');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401: {
        const isAuthPage = window.location.pathname.startsWith('/login');
        if (!isAuthPage) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirection vers la page de connexion
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          
          // CORRECTION : On "avale" l'erreur pour empêcher 
          // l'affichage des pop-ups d'erreur rouges dans l'interface
          return new Promise(() => {}); 
        }
        break;
      }

      case 403:
        console.error('[Axios] 403 — Accès interdit');
        break;

      case 409:
        break;

      default:
        if (status >= 500) {
          console.error('[Axios] Erreur serveur', status, data?.message);
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;