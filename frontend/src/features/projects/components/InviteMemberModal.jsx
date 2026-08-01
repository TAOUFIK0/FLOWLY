/* ========================================
   InviteMemberModal — Inviter un membre
   ======================================== */

import { useState } from 'react';
import { FiX, FiMail, FiShield, FiUser, FiSend, FiLoader } from 'react-icons/fi';
import './InviteMemberModal.css';
import { projectsApi } from '../api';
const ROLES = [
  {
    value: 'MEMBER',
    label: 'Membre',
    desc: 'Peut créer et gérer ses tâches assignées',
    icon: <FiUser size={18} />,
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
    desc: 'Peut inviter des membres et assigner des tâches',
    icon: <FiShield size={18} />,
    color: 'var(--warning)',
    bg: 'var(--warning-light)',
  },
];

export default function InviteMemberModal({ projectId, onClose, onInvited }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('L\'adresse e-mail est requise');
      return;
    }

    /* Validation basique de l'email */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'e-mail invalide');
      return;
    }

    setError('');
    setLoading(true);

   try {
      await projectsApi.inviteMember(projectId, { email: email.trim(), role });
      setSent(true);
      onInvited?.();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.includes('déjà') || msg?.includes('already') || err.response?.status === 409) {
        setError('Cet utilisateur est déjà membre du projet');
      } else if (err.response?.status === 403) {
        setError('Vous n\'avez pas la permission d\'inviter des membres');
      } else if (err.response?.status === 404) {
        setError('Projet introuvable');
      } else {
        setError(msg || 'Erreur lors de l\'envoi de l\'invitation');
      }
    } finally {
      setLoading(false);
    }};

  const handleReset = () => {
    setEmail('');
    setRole('MEMBER');
    setSent(false);
    setError('');
  };

  return (
    <div className="imm-overlay" onClick={onClose}>
      <div className="imm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="imm-header">
          <h2 className="imm-title">Inviter un membre</h2>
          <button className="imm-close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="imm-body">
          {/* ── État : succès ── */}
          {sent ? (
            <div className="imm-success">
              <div className="imm-success-icon">✉️</div>
              <h3 className="imm-success-title">Invitation envoyée !</h3>
              <p className="imm-success-desc">
                Un e-mail a été envoyé à <strong>{email}</strong>.
                Il recevra une notification dans son espace personnel.
              </p>
              <div className="imm-success-actions">
                <button className="btn btn-secondary" onClick={handleReset}>
                  Inviter quelqu'un d'autre
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  Terminé
                </button>
              </div>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form className="imm-form" onSubmit={handleSubmit}>

              {/* Info projet */}
              <div className="imm-info">
                <span className="imm-info-label">Projet</span>
                <span className="imm-info-value">#{projectId}</span>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <FiMail size={14} />
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className={`form-input imm-input ${error ? 'error' : ''}`}
                  placeholder="collaborateur@entreprise.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoFocus
                />
                {error && <span className="form-error">{error}</span>}
              </div>

              {/* Sélection du rôle */}
              <div className="form-group">
                <label className="form-label">Rôle dans ce projet</label>
                <div className="imm-roles">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`imm-role ${role === r.value ? 'imm-role-active' : ''}`}
                      style={{
                        '--role-color': r.color,
                        '--role-bg': r.bg,
                      }}
                      onClick={() => setRole(r.value)}
                    >
                      <div className="imm-role-icon">{r.icon}</div>
                      <div className="imm-role-text">
                        <span className="imm-role-label">{r.label}</span>
                        <span className="imm-role-desc">{r.desc}</span>
                      </div>
                      <div className="imm-role-check" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <p className="imm-note">
                L'invité recevra une notification dans son espace personnel.
                S'il n'a pas de compte, un e-mail d'inscription lui sera envoyé.
              </p>

              {/* Actions */}
              <div className="imm-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <FiLoader size={16} className="imm-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Envoyer l'invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
  }