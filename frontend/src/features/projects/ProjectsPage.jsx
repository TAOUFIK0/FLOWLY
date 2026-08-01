/* ========================================
   ProjectsPage — Liste des projets
   ======================================== */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import Sidebar from '../workspace/Sidebar';
import BoardCard from './components/BoardCard';
import CreateBoardModal from './components/CreateBoardModal';
import {
  setProjectsLoading,
  setProjects,
  setTemplates,
  addProject,
  setProjectsError,
} from './projectsSlice';
import { projectsApi } from './api';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items, templates, loading, error } = useSelector((state) => state.projects);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // View pour la grille ou la liste

  /* Charger les projets */
  useEffect(() => {
    dispatch(setProjectsLoading(true));
    projectsApi
      .getAll()
      .then((res) => dispatch(setProjects(res.data)))
      .catch((err) => dispatch(setProjectsError(err.response?.data?.message || 'Erreur de chargement')));

    /* Charger les templates en parallèle */
    projectsApi
      .getTemplates()
      .then((res) => dispatch(setTemplates(res.data)))
      .catch(() => {});
  }, [dispatch]);

  /* Créer un projet */
  const handleCreate = async (data) => {
    try {
      const res = await projectsApi.create(data);
      dispatch(addProject(res.data));
      setShowModal(false);
    } catch (err) {
      dispatch(setProjectsError(err.response?.data?.message || "Erreur lors de la création"));
    }
  };

  /* Filtrer par recherche */
  const filtered = items.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pp-layout">
      <Sidebar />

      <main className="pp-main">
        {/* Header */}
        <div className="pp-header">
          <div>
            <h1 className="pp-title">Mes projets</h1>
            <p className="pp-subtitle">
              {items.length} projet{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus size={16} />
            Nouveau projet
          </button>
        </div>

        {/* Barre d'outils */}
        <div className="pp-toolbar">
          <div className="pp-search">
            <FiSearch size={16} className="pp-search-icon" />
            <input
              type="text"
              className="pp-search-input"
              placeholder="Rechercher un projet…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="pp-view-toggle">
            <button
              className={`pp-view-btn ${view === 'grid' ? 'pp-view-active' : ''}`}
              onClick={() => setView('grid')}
              title="Vue grille"
            >
              <FiGrid size={16} />
            </button>
            <button
              className={`pp-view-btn ${view === 'list' ? 'pp-view-active' : ''}`}
              onClick={() => setView('list')}
              title="Vue liste"
            >
              <FiList size={16} />
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="pp-error">
            <span>{error}</span>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        )}

        {/* Loader */}
        {loading && items.length === 0 ? (
          <div className="pp-loader">
            <div className="spinner spinner-lg" />
            <span>Chargement des projets…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-icon">📁</div>
            <h3>{search ? 'Aucun résultat' : 'Aucun projet'}</h3>
            <p>
              {search
                ? 'Essayez un autre terme de recherche.'
                : 'Créez votre premier projet pour commencer.'}
            </p>
            {!search && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FiPlus size={16} />
                Créer un projet
              </button>
            )}
          </div>
        ) : (
          <div className={`pp-grid ${view === 'list' ? 'pp-grid-list' : ''}`}>
            {filtered.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </main>

      {/* Modal création */}
      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          templates={templates}
        />
      )}
    </div>
  );
}