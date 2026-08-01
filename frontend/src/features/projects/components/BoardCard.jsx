/* ========================================
   BoardCard — Carte de projet
   ======================================== */

import { useNavigate } from 'react-router-dom';
import {
  FiFolder,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import './BoardCard.css';

export default function BoardCard({ board, onDelete }) {
  const navigate = useNavigate();

  const memberCount = board.members?.length || 0;
  const taskCount = board.taskCount || 0;
  const doneCount = board.doneCount || 0;
  const progress = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  /* Initiales du créateur */
  const initials = board.owner?.name
    ? board.owner.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <div className="bc-card" onClick={() => navigate(`/projects/${board.id}`)}>
      {/* Barre de couleur */}
      <div className="bc-color-bar" style={{ background: board.color || 'var(--primary)' }} />

      <div className="bc-body">
        {/* Titre */}
        <h3 className="bc-title">{board.name}</h3>
        {board.description && (
          <p className="bc-desc">{board.description}</p>
        )}

        {/* Stats */}
        <div className="bc-stats">
          <span className="bc-stat">
            <FiFolder size={13} />
            {taskCount} tâche{taskCount !== 1 ? 's' : ''}
          </span>
          {memberCount > 0 && (
            <span className="bc-stat">
              <FiUsers size={13} />
              {memberCount} membre{memberCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Progression */}
        {taskCount > 0 && (
          <div className="bc-progress">
            <div className="bc-progress-bar" style={{ width: `${progress}%` }} />
            <span className="bc-progress-label">{progress}%</span>
          </div>
        )}

        {/* Footer */}
        <div className="bc-footer">
          {board.updatedAt && (
            <span className="bc-updated">
              <FiClock size={12} />
              {board.updatedAt}
            </span>
          )}
          {initials && (
            <div className="bc-avatar" title={board.owner.name}>
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}