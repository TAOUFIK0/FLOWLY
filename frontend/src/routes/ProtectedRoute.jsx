/* ========================================
   Garde d'authentification (Layout Route)
   ======================================== */

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Composant de route protégée.
 * Deux modes d'utilisation :
 *   1. Wrapper : <ProtectedRoute><Page /></ProtectedRoute>
 *   2. Layout  : <Route element={<ProtectedRoute />}><Route .../></Route>
 */
export default function ProtectedRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  /* Non authentifié → redirige vers login avec l'URL demandée */
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  /* Mode wrapper (legacy) : children passé directement */
  if (children) {
    return children;
  }

  /* Mode layout route : rend les routes enfants via Outlet */
  return <Outlet />;
}
