/* ========================================
   ProjectSettingsModal — Paramètres du projet
   ======================================== */

import { useState } from 'react';
import { FiX, FiSave, FiTrash2, FiCalendar } from 'react-icons/fi';
import { projectsApi } from '../api';
import './InviteMemberModal.css'; // On réutilise le même style de modal globalement

const STATUS_OPTIONS = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'EN_PAUSE', label: 'En pause' },
  { value: 'TERMINE', label: 'Terminé' },
];

export default function ProjectSettingsModal({ project, onClose, onUpdated, onDelete }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState(project?.status || 'ACTIF');
  const [startDate, setStartDate] = useState(project?.startDate ? project.startDate.split('T')[0] : '');
  const [endDate, setEndDate] = useState(project?.endDate ? project.endDate.split('T')[0] : '');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await projectsApi.update(project.id, {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
      });
      onUpdated?.(); // On prévient le parent de rafraîchir le nom dans le topbar
      onClose();
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete?.();
      onClose();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="imm-overlay" onClick={onClose}>
      <div className="imm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div className="imm-header">
          <h2 className="imm-title">Paramètres du projet</h2>
          <button className="imm-close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="imm-body">
          <form className="imm-form" onSubmit={handleSave}>
            
            {/* Nom du projet */}
            <div className="form-group">
              <label className="form-label">Nom du projet</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Statut */}
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label"><FiCalendar size={14} style={{marginRight: '6px'}}/>Date de début</label>
                <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label"><FiCalendar size={14} style={{marginRight: '6px'}}/>Date de fin</label>
                <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            {/* Bouton sauvegarder */}
            <div className="imm-actions" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave size={16} />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>

          {/* Séparateur */}
          <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '30px 0 20px' }} />

          {/* Zone Dangereuse */}
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--danger)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Zone dangereuse
            </h3>
            {!showDeleteConfirm ? (
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowDeleteConfirm(true)}
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                <FiTrash2 size={14} />
                Supprimer ce projet
              </button>
            ) : (
              <div style={{ background: 'var(--danger-light)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--danger)' }}>
                <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--danger)' }}>
                  Cette action est <strong>définitive</strong>. Toutes les tâches et données seront perdues.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Annuler</button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    <FiTrash2 size={14} />
                    Confirmer la suppression
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

