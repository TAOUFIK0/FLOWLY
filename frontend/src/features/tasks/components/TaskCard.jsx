/* ========================================
   TaskCard — Carte de tâche Kanban
   ======================================== */

import { useState, useEffect } from 'react';
import './TaskCard.css';

const PRIORITY_COLORS = {
  LOW: 'var(--text-muted)',
  MEDIUM: 'var(--info)',
  HIGH: 'var(--warning)',
  URGENT: 'var(--danger)',
};

export default function TaskCard({ task, members = [], onClick, onDragStart, onUpdate }) {
  const borderColor = PRIORITY_COLORS[task.priority] || 'var(--text-muted)';
  
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  // ON UTILISE DIRECTEMENT LE NOM ENVOYÉ PAR LE BACKEND
  const assigneeName = task.assigneeName;
  const initials = assigneeName
    ? assigneeName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  const handleDragStart = (e) => {
    onDragStart?.(e, task.id);
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
    if (titleValue.trim() && titleValue !== task.title) {
      onUpdate?.(task.id, { title: titleValue.trim() });
    } else if (!titleValue.trim()) {
      setTitleValue(task.title);
    }
  };

  return (
    <div
      className="tc-card"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          onClick?.(task);
        }
      }}
    >
      {task.labels?.length > 0 && (
        <div className="tc-labels">
          {(task.labels.map(l => l.name || l)).slice(0, 2).map((label) => (
            <span key={label} className="tc-label">{label}</span>
          ))}
          {task.labels.length > 2 && <span className="tc-label-more">+{task.labels.length - 2}</span>}
        </div>
      )}

      {isEditing ? (
        <input
          type="text"
          className="tc-title-input"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={handleSaveTitle}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') { setTitleValue(task.title); setIsEditing(false); }}}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p 
          className="tc-title" 
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          title="Cliquez pour renommer"
        >
          {task.title}
        </p>
      )}

      <div className="tc-footer">
        {assigneeName ? (
          <div className="tc-assignee">
            <div className="tc-assignee-avatar">{initials}</div>
            <span className="tc-assignee-name">{assigneeName}</span>
          </div>
        ) : (
          <span className="tc-unassigned">Non assigné</span>
        )}

        <div className="tc-icons">
          {task.commentCount > 0 && (
            <span className="tc-icon" title={`${task.commentCount} commentaire(s)`}>
              💬 {task.commentCount}
            </span>
          )}
          {task.description && (
            <span className="tc-icon" title="Contient une description">📝</span>
          )}
        </div>
      </div>
    </div>
  );
}
