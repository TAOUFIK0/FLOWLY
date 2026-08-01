/* ========================================
   Routes principales de l'application
   ======================================== */

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

/* ── Pages publiques (lazy loaded) ── */
const LandingPage = lazy(() => import('../components/landing/LandingPage'));
const FeaturesPage = lazy(() => import('../components/landing/FeaturesPage'));
const SolutionsPage = lazy(() => import('../components/landing/SolutionsPage'));
const HowItWorksPage = lazy(() => import('../components/landing/HowItWorksPage'));
const ResourcesPage = lazy(() => import('../components/landing/ResourcesPage'));
const PricingPage = lazy(() => import('../components/landing/PricingPage'));

/* ── Auth (lazy loaded) ── */
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));

/* ── Workspace (lazy loaded) ── */
const WorkspacePage = lazy(() => import('../features/workspace/WorkspacePage'));
const ProjectsPage = lazy(() => import('../features/projects/ProjectsPage'));
const KanbanBoard = lazy(() => import('../features/tasks/KanbanBoard'));
const InboxPage = lazy(() => import('../features/inbox/InboxPage'));
const PlannerPage = lazy(() => import('../features/planner/PlannerPage')); // AJOUTÉ

/* ── Fallback de chargement ── */
function LoadingFallback() {
  return (
    <div className="page-loader">
      <div className="spinner spinner-lg" />
      <span>Chargement…</span>
    </div>
  );
}

export default function AppRouter() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ===== Pages publiques (Landing) ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* ===== Authentification ===== */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/workspace" replace />
              : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/workspace" replace />
              : <RegisterPage />
          }
        />

        {/* ===== Routes protégées ===== */}
        <Route element={<ProtectedRoute />}>
  <Route path="/workspace" element={<WorkspacePage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:projectId" element={<KanbanBoard />} />
  <Route path="/inbox" element={<InboxPage />} />
  <Route path="/planner" element={<PlannerPage />} /> {/* AJOUTÉ */}
</Route>

        {/* ===== 404 → redirige selon l'état auth ===== */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/workspace' : '/'} replace />
          }
        />
      </Routes>
    </Suspense>
  );
}