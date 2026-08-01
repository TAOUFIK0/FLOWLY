/* ========================================
   TaskDetailModal — Détail d'une tâche
   ======================================== */

import { useState } from 'react';
import {
  FiX,
  FiClock,
  FiUser,
  FiTag,
  FiMessageSquare,
  FiPaperclip,
  FiSend,
  FiTrash2,
} from 'react-icons/fi';
import './TaskDetailModal.css';

const PRIORITY_OPTIONS = [
  { value: 'LOW',    label: 'Basse',    color: 'var(--text-muted)', bg: 'var(--bg-dark)' },
  { value: 'MEDIUM', label: 'Moyenne',  color: 'var(--info)',      bg: 'var(--info-light)' },
  { value: 'HIGH',   label: 'Haute',    color: 'var(--warning)',   bg: 'var(--warning-light)' },
  { value: 'URGENT', label: 'Urgente',  color: 'var(--danger)',    bg: 'var(--danger-light)' },
];

export default function TaskDetailModal({
  task,
  onClose,
  onUpdate,
  onAddComment,
  onDelete,
  canDelete = false,
  members = [],
}) {
  const [comment, setComment] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [newLabel, setNewLabel] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task?.title || '');
  const [localAssigneeId, setLocalAssigneeId] = useState(task?.assigneeId || '');
  const [localLabels, setLocalLabels] = useState(task?.labels?.map(l => l.name || l) || []);
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const priority = PRIORITY_OPTIONS.find((p) => p.value === task.priority) || PRIORITY_OPTIONS[1];
  const overdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString());
  const assignee = members.find((m) => m.userId === localAssigneeId);
  const initials = assignee?.name
    ? assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment?.(task.id, comment.trim());
      setComment('');
    }
  };

  const handleSaveDesc = () => {
    setEditingDesc(false);
  };

  const handleAssigneeChange = (e) => {
    const selectedId = e.target.value;
    setLocalAssigneeId(selectedId);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const payload = {
      title: titleValue.trim() || task.title,
      description: descValue,
      assigneeId: localAssigneeId === '' ? null : localAssigneeId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      labels: localLabels,
    };

    try {
      await onUpdate?.(task.id, payload);
      onClose();
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAddLabel = () => {
    if (!newLabel.trim()) return;
    setLocalLabels([...localLabels, newLabel.trim()]);
    setNewLabel('');
  };

  const handleRemoveLabel = (labelToRemove) => {
    setLocalLabels(localLabels.filter((l) => l !== labelToRemove));
  };

  return (
    <div className="tdm-overlay" onClick={onClose}>
      <div className="tdm-modal" onClick={(e) => e.stopPropagation()}>

        <div className="tdm-header">
          <div className="tdm-header-left">
            <span className="tdm-priority" style={{ background: priority.bg, color: priority.color }}>
              {priority.label}
            </span>
            {localLabels.map((l) => (
              <span key={l} className="tdm-label" style={{ background: 'var(--bg-dark)' }}>
                {l}
              </span>
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canDelete && (
              <button
                onClick={() => {
                  if (window.confirm('Supprimer cette tâche ?')) {
                    onDelete?.(task.id);
                    onClose();
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
              >
                <FiTrash2 size={15} />
                <span>Supprimer</span>
              </button>
            )}
            <button className="tdm-close" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="tdm-body">
          <div className="tdm-main">
            
            {editTitle ? (
              <input
                type="text"
                className="form-input"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={() => setEditTitle(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditTitle(false); }}
                autoFocus
                style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '20px' }}
              />
            ) : (
              <h2 className="tdm-title" onClick={() => setEditTitle(true)} style={{ cursor: 'text' }}>
                {titleValue}
              </h2>
            )}

            <div className="tdm-section">
              <h4 className="tdm-section-title"><FiPaperclip size={14} /> Description</h4>
              {editingDesc ? (
                <div className="tdm-desc-edit">
                  <textarea className="form-input tdm-desc-textarea" value={descValue} onChange={(e) => setDescValue(e.target.value)} autoFocus />
                  <div className="tdm-desc-actions">
                    <button className="btn btn-primary btn-sm" onClick={handleSaveDesc}>Enregistrer</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingDesc(false)}>Annuler</button>
                  </div>
                </div>
              ) : (
                <p className={`tdm-desc ${!descValue ? 'tdm-desc-empty' : ''}`} onClick={() => setEditingDesc(true)}>
                  {descValue || 'Cliquez pour ajouter une description…'}
                </p>
              )}
            </div>

            <div className="tdm-section">
              <h4 className="tdm-section-title"><FiMessageSquare size={14} /> Commentaires ({task.comments?.length || 0})</h4>
              <div className="tdm-comments">
                {(task.comments || []).map((c) => (
                  <div key={c.id} className="tdm-comment">
                    <div className="tdm-comment-avatar">
                      {c.author?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                    </div>
                    <div className="tdm-comment-body">
                      <div className="tdm-comment-meta">
                        <span className="tdm-comment-author">{c.author?.name || 'Utilisateur'}</span>
                        <span className="tdm-comment-time">{c.createdAt || 'à l\'instant'}</span>
                      </div>
                      <p className="tdm-comment-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form className="tdm-comment-form" onSubmit={handleSubmitComment}>
                <input type="text" className="form-input tdm-comment-input" placeholder="Écrire un commentaire…" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit" className="btn btn-primary tdm-comment-send" disabled={!comment.trim()}>
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>

          <div className="tdm-sidebar">
            {/* --- Assigné --- */}
            <div className="tdm-field">
              <span className="tdm-field-label"><FiUser size={13} /> Assigné à</span>
              <select 
                className="form-input" 
                value={localAssigneeId} 
                onChange={handleAssigneeChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Non assigné</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>{m.name} {m.isCurrentUser ? '(vous)' : ''}</option>
                ))}
              </select>

              {/* Affichage visuel */}
              {assignee && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px', background: 'var(--bg-light, #f8fafc)', borderRadius: 'var(--radius, 8px)' }}>
                  <div style={{
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-light, #dbeafe)', 
                    color: 'var(--primary, #3b82f6)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '11px', 
                    fontWeight: '600'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '13px', 
                      color: 'var(--text-main, #1e293b)', 
                      fontWeight: '500',
                      display: 'inline-block',
                      textDecoration: 'none' /* CORRECTION DÉFINITIVE ICI */
                    }}>
                      {assignee.name}
                    </span>
                    {assignee.isCurrentUser && <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>(vous)</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="tdm-field">
              <span className="tdm-field-label"><FiClock size={13} /> Échéance</span>
              <input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              {overdue && <span style={{fontSize: '12px', color: 'var(--danger)', marginTop: '4px', display: 'block'}}>En retard</span>}
            </div>

            <div className="tdm-field">
              <span className="tdm-field-label"><FiTag size={13} /> Labels</span>
              {localLabels.length > 0 && (
                <div className="tdm-labels">
                  {localLabels.map((labelName) => (
                    <span key={labelName} className="tdm-label" style={{ background: 'var(--bg-dark)', display: 'inline-flex', alignItems: 'center', gap: '6px', paddingRight: '6px' }}>
                      {labelName}
                      <button onClick={() => handleRemoveLabel(labelName)} style={{background:'none', border:'none', color:'inherit', cursor:'pointer', padding:0, display:'flex'}}>
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ajouter un label..." 
                  value={newLabel} 
                  onChange={(e) => setNewLabel(e.target.value)} 
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' && newLabel.trim()) { 
                      e.preventDefault(); 
                      handleAddLabel(); 
                    } 
                  }} 
                  style={{flex: 1, fontSize: '13px'}} 
                />
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => { 
                    if(newLabel.trim()) { 
                      handleAddLabel(); 
                    } 
                  }} 
                  disabled={!newLabel.trim()}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Pied de modal avec le bouton Enregistrer --- */}
        <div style={{ borderTop: '1px solid var(--border, #e2e8f0)', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            Enregistrer les modifications
          </button>
        </div>

      </div>
    </div>
  );
}





