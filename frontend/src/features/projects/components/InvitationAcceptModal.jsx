/* ========================================
   InvitationAcceptModal — Accepter/refuser une invitation
   ======================================== */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiFolder,
  FiUser,
  FiShield,
  FiCheck,
  FiXCircle,
  FiLoader,
} from 'react-icons/fi';
import { projectsApi } from "../api";
import './InvitationAcceptModal.css';

/* Label du rôle */
function RoleLabel({ role }) {
  switch (role) {
    case 'OWNER':  return <span className="iam-role iam-role-owner">Owner</span>;
    case 'MANAGER': return <span className="iam-role iam-role-manager">Manager</span>;
    default:      return <span className="iam-role iam-role-member">Membre</span>;
  }
}

/* Icône du rôle */
function RoleIcon({ role }) {
  switch (role) {
    case 'OWNER':  return <FiShield size={18} className="iam-role-icon iamo-owner" />;
    case 'MANAGER': return <FiShield size={18} className="iam-role-icon iamo-manager" />;
    default:      return <FiUser size={18} className="iam-role-icon iamo-member" />;
  }
}

export default function InvitationAcceptModal({ invitation, onClose, onResponded }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null); // 'accepting' | 'declining' | null
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // 'accepted' | 'declined'

  if (!invitation) return null;

  const handleRespond = async (accepted) => {
    setLoading(accepted ? 'accepting' : 'declining');
    setError('');

    try {
      await projectsApi.respondToInvitation(invitation.id, { accepted });

      setResult(accepted ? 'accepted' : 'declined');
      onResponded?.(invitation.id, accepted);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 404) {
        setError('Cette invitation n\'existe plus ou a expiré');
      } else if (err.response?.status === 410) {
        setError('Cette invitation a expiré');
      } else {
        setError(msg || 'Erreur lors de la réponse à l\'invitation');
      }
    } finally {
      setLoading(null);
    }
  };

  const handleClose = () => {
    /* Si l'utilisateur a accepté, naviguer vers le projet */
    if (result === 'accepted' && invitation.projectId) {
      navigate(`/projects/${invitation.projectId}`);
    }
    onClose();
  };

  /* ── État : résultat ── */
  if (result) {
    return (
      <div className="iam-overlay" onClick={handleClose}>
        <div className="iam-modal" onClick={(e) => e.stopPropagation()}>
          <div className="iam-result">
            <div className="iam-result-icon">
              {result === 'accepted' ? '🎉' : '👋'}
            </div>
            <h3 className="iam-result-title">
              {result === 'accepted'
                ? 'Vous avez rejoint le projet !'
                : 'Invitation déclinée'}
            </h3>
            {result === 'accepted' && invitation.projectName && (
              <p className="iam-result-project">
                <FiFolder size={16} />
                {invitation.projectName}
              </p>
            )}
            <p className="iam-result-desc">
              {result === 'accepted'
                ? 'Vous pouvez maintenant accéder au tableau Kanban et collaborer avec l\'équipe.'
                : 'Vous ne recevrez plus de notifications pour cette invitation.'}
            </p>
            <button className="btn btn-primary" onClick={handleClose}>
              {result === 'accepted' ? 'Accéder au projet' : 'Fermer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── État : formulaire ── */
  return (
    <div className="iam-overlay" onClick={handleClose}>
      <div className="iam-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="iam-header">
          <h2 className="iam-title">Invitation à un projet</h2>
          <button className="iam-close" onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="iam-body">
          {/* Carte projet */}
          <div className="iam-card">
            <div
              className="iam-card-color"
              style={{ background: invitation.projectColor || 'var(--primary)' }}
            />
            <div className="iam-card-content">
              <div className="iam-card-icon">
                <FiFolder size={20} />
              </div>
              <div>
                <h3 className="iam-card-name">{invitation.projectName || 'Projet'}</h3>
                <span className="iam-card-id">#{invitation.projectId}</span>
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="iam-details">
            {/* Invité par */}
            <div className="iam-detail">
              <span className="iam-detail-label">Invité par</span>
              <div className="iam-detail-value">
                <div className="iam-avatar">
                  {invitation.inviterName
                    ? invitation.inviterName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                    : '??'}
                </div>
                <span>{invitation.inviterName || 'Un membre'}</span>
              </div>
            </div>

            {/* Votre rôle */}
            <div className="iam-detail">
              <span className="iam-detail-label">Votre rôle</span>
              <div className="iam-detail-value">
                <RoleIcon role={invitation.role} />
                <RoleLabel role={invitation.role} />
              </div>
            </div>

            {/* Date */}
            {invitation.sentAt && (
              <div className="iam-detail">
                <span className="iam-detail-label">Envoyée le</span>
                <span className="iam-detail-text">
                  {new Date(invitation.sentAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Message personnel */}
          {invitation.message && (
            <div className="iam-message">
              <span className="iam-message-label">Message</span>
              <p className="iam-message-text">"{invitation.message}"</p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="iam-error">{error}</div>
          )}

          {/* Boutons */}
          <div className="iam-actions">
            <button
              className="iam-btn iam-btn-decline"
              onClick={() => handleRespond(false)}
              disabled={loading !== null}
            >
              {loading === 'declining' ? (
                <><FiLoader size={16} className="iam-spin" /> Refus…</>
              ) : (
                <><FiXCircle size={16} /> Décliner</>
              )}
            </button>
            <button
              className="iam-btn iam-btn-accept"
              onClick={() => handleRespond(true)}
              disabled={loading !== null}
            >
              {loading === 'accepting' ? (
                <><FiLoader size={16} className="iam-spin" /> Acceptation…</>
              ) : (
                <><FiCheck size={16} /> Accepter l'invitation</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
