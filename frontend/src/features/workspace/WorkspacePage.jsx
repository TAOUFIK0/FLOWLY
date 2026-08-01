/* ========================================
   WorkspacePage — Tableau de bord principal
   ======================================== */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiFolder,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiPlus,
} from 'react-icons/fi';
import Sidebar from './Sidebar';
import './WorkspacePage.css';

/* Données mock — seront remplacées par l'API */
const RECENT_BOARDS = [
  { id: 1, name: 'Refonte site web', color: '#0D9488', cardCount: 12, taskDone: 8 },
  { id: 2, name: 'Application mobile', color: '#F97316', cardCount: 24, taskDone: 16 },
  { id: 3, name: 'Campagne marketing Q3', color: '#06B6D4', cardCount: 8, taskDone: 5 },
];

const ACTIVITY = [
  { id: 1, text: 'Karim a déplacé "Header responsive" dans Fait', time: 'Il y a 5 min', type: 'move' },
  { id: 2, text: 'Sophie a commenté sur "Design system"', time: 'Il y a 20 min', type: 'comment' },
  { id: 3, text: 'Vous avez été assigné à "API auth"', time: 'Il y a 1h', type: 'assign' },
  { id: 4, text: 'Léa a créé le tableau "Sprint 12"', time: 'Il y a 2h', type: 'create' },
  { id: 5, text: 'Échéance atteinte sur "Fix bug login"', time: 'Il y a 3h', type: 'overdue' },
];

const STATS = [
  { label: 'Projets actifs', value: 3, icon: <FiFolder size={20} />, color: 'var(--primary)', bg: 'var(--primary-light)' },
  { label: 'Tâches en cours', value: 15, icon: <FiClock size={20} />, color: 'var(--warning)', bg: 'var(--warning-light)' },
  { label: 'Terminées cette semaine', value: 29, icon: <FiCheckCircle size={20} />, color: 'var(--success)', bg: 'var(--success-light)' },
  { label: 'En retard', value: 2, icon: <FiAlertCircle size={20} />, color: 'var(--danger)', bg: 'var(--danger-light)' },
];

export default function WorkspacePage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  /* Rediriger si pas de token (sécurité supplémentaire) */
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

const firstName = user?.name?.split(' ')[0] || user?.firstName || user?.username || 'Utilisateur';

  return (
    <div className="ws-layout">
      <Sidebar />

      <main className="ws-main">
        {/* ── En-tête ── */}
        <div className="ws-welcome">
          <div>
            <h1 className="ws-welcome-title">
              Bonjour, {firstName} 
            </h1>
            <p className="ws-welcome-subtitle">
              Voici un aperçu de votre espace de travail.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/projects')}
          >
            <FiPlus size={16} />
            Nouveau projet
          </button>
        </div>

        {/* ── Statistiques ── */}
        <div className="ws-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="ws-stat-card">
              <div className="ws-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="ws-stat-text">
                <span className="ws-stat-value">{stat.value}</span>
                <span className="ws-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Contenu : projets récents + activité ── */}
        <div className="ws-content">

          {/* Projets récents */}
          <div className="ws-section">
            <div className="ws-section-header">
              <h2 className="ws-section-title">Projets récents</h2>
              <button className="ws-section-link" onClick={() => navigate('/projects')}>
                Voir tout
                <FiArrowRight size={14} />
              </button>
            </div>
            <div className="ws-boards">
              {RECENT_BOARDS.map((board) => (
                <div
                  key={board.id}
                  className="ws-board-card"
                  onClick={() => navigate(`/projects/${board.id}`)}
                >
                  <div className="ws-board-color" style={{ background: board.color }} />
                  <div className="ws-board-info">
                    <h3 className="ws-board-name">{board.name}</h3>
                    <div className="ws-board-meta">
                      <span>{board.cardCount} tâches</span>
                      <span>·</span>
                      <span>{board.taskDone} terminées</span>
                    </div>
                  </div>
                  {/* Barre de progression */}
                  <div className="ws-board-progress">
                    <div
                      className="ws-board-progress-bar"
                      style={{
                        width: `${Math.round((board.taskDone / board.cardCount) * 100)}%`,
                        background: board.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="ws-section">
            <div className="ws-section-header">
              <h2 className="ws-section-title">Activité récente</h2>
            </div>
            <div className="ws-activity">
              {ACTIVITY.map((item) => (
                <div key={item.id} className="ws-activity-item">
                  <div className={`ws-activity-dot ws-activity-${item.type}`} />
                  <div className="ws-activity-text">
                    <span>{item.text}</span>
                    <span className="ws-activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}