/* ========================================
   NotificationPanel — Popover hors écran
   S'ouvre à côté de la cloche, pas en dropdown
   ======================================== */

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom'; // <-- AJOUT DU PORTAL
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiMessageSquare,
  FiUserPlus,
  FiAlertCircle,
  FiClock,
  FiExternalLink,
} from 'react-icons/fi';
import InvitationAcceptModal from '../projects/components/InvitationAcceptModal';
import {
  setNotifications,
  markAsRead,
  markAllRead,
  removeNotification,
  setNotificationsLoading,
} from './notificationsSlice';
import axiosInstance from '../../api/axiosInstance';
import './NotificationPanel.css';

/* ── Icône selon le type ── */
const TYPE_CONFIG = {
  TASK_ASSIGNED:    { icon: <FiUserPlus size={16} />, color: 'var(--primary)',  bg: 'var(--primary-light)' },
  TASK_COMMENT:     { icon: <FiMessageSquare size={16} />, color: 'var(--info)', bg: 'var(--info-light)' },
  TASK_MENTION:     { icon: <FiMessageSquare size={16} />, color: 'var(--accent)', bg: 'var(--accent-light)' },
  TASK_DUE_SOON:    { icon: <FiClock size={16} />, color: 'var(--warning)', bg: 'var(--warning-light)' },
  TASK_OVERDUE:     { icon: <FiAlertCircle size={16} />, color: 'var(--danger)',  bg: 'var(--danger-light)' },
  PROJECT_INVITE:   { icon: <FiUserPlus size={16} />, color: 'var(--primary)',  bg: 'var(--primary-light)' },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.TASK_COMMENT;
}

/* ── Formatage date relative ── */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'À l\'instant';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function NotificationPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount, loading } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  /* Références pour le bouton cloche ET le popover (pour le clic extérieur) */
  const bellRef = useRef(null);
  const popoverRef = useRef(null); // <-- AJOUT

  /* Charger les notifications à l'ouverture */
  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(setNotificationsLoading(true));
      axiosInstance
        .get('/notifications')
        .then((res) => dispatch(setNotifications(res.data)))
        .catch(() => {})
        .finally(() => dispatch(setNotificationsLoading(false)));
    }
  }, [open, items.length, dispatch]);

  /* Fermer au clic extérieur (mais pas au clic intérieur) */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      // On vérifie si le clic est EN DEHORS de la cloche ET EN DEHORS du popover
      if (
        bellRef.current && !bellRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  /* Fermer avec Escape */
  useEffect(() => {
    if (!open && !selectedInvitation) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedInvitation) {
          setSelectedInvitation(null);
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, selectedInvitation]);

  /* Clic sur une notification */
  const handleNotifClick = (notif) => {
    if (!notif.read) dispatch(markAsRead(notif.id));

    /* Si c'est une invitation de projet → ouvrir le modal d'acceptation */
    if (notif.type === 'PROJECT_INVITE') {
      setSelectedInvitation(notif.data || notif);
      return;
    }

    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  /* Après réponse à une invitation */
  const handleInvitationResponded = (invitationId, accepted) => {
    if (accepted) {
      dispatch(removeNotification(invitationId));
    } else {
      dispatch(markAsRead(invitationId));
    }
  };

  /* Tout marquer comme lu */
  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      dispatch(markAllRead());
    } catch {
      dispatch(markAllRead());
    }
  };

  /* Supprimer une notification */
  const handleRemove = (e, id) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };

  /* Position calculée dynamiquement par rapport au bouton */
  const positionStyle = (() => {
    if (!bellRef.current || !open) return { display: 'none' };

    const rect = bellRef.current.getBoundingClientRect();
    const panelWidth = 380;

    /* Par défaut : à droite du bouton, aligné en haut */
    let top = rect.bottom + 10;
    let left = rect.right + 10;

    /* Si ça déborde à droite de l'écran, basculer à gauche du bouton */
    if (left + panelWidth > window.innerWidth) {
      left = rect.left - panelWidth - 10;
    }

    /* Si ça déborde en bas de l'écran, remonter au-dessus */
    if (top + 400 > window.innerHeight) {
      top = rect.top - 400 - 10;
    }

    return { display: 'block', top: `${top}px`, left: `${left}px`, position: 'fixed' };
  })();

  return (
    <>
      {/* Bouton cloche */}
      <button
        ref={bellRef}
        className={`np-bell ${open ? 'np-bell-open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} non lues` : ''}`}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="np-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Popover "téléporté" dans le body pour éviter les bugs de position CSS */}
      {open && createPortal(
        <div ref={popoverRef} className="np-popover" style={positionStyle}>
          {/* Flèche vers le bouton */}
          <div className="np-popover-arrow" />

          {/* Contenu du popover */}
          <div className="np-popover-content">
            {/* Header */}
            <div className="np-header">
              <h3 className="np-header-title">Notifications</h3>
              {unreadCount > 0 && (
                <button className="np-mark-all" onClick={handleMarkAllRead}>
                  <FiCheck size={14} />
                  Tout lire
                </button>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="np-list">
              {loading ? (
                <div className="np-empty">
                  <div className="spinner" />
                  <span>Chargement…</span>
                </div>
              ) : items.length === 0 ? (
                <div className="np-empty">
                  <FiBell size={32} />
                  <span>Aucune notification</span>
                  <span className="np-empty-sub">Les nouvelles notifications apparaîtront ici</span>
                </div>
              ) : (
                items.map((notif) => {
                  const typeConf = getTypeConfig(notif.type);
                  const isInvitation = notif.type === 'PROJECT_INVITE';

                  return (
                    <div
                      key={notif.id}
                      className={`np-item ${!notif.read ? 'np-item-unread' : ''} ${isInvitation ? 'np-item-actionable' : ''}`}
                      onClick={() => handleNotifClick(notif)}
                    >
                      <div
                        className="np-item-icon"
                        style={{ background: typeConf.bg, color: typeConf.color }}
                      >
                        {typeConf.icon}
                      </div>

                      <div className="np-item-content">
                        <p className="np-item-message">
                          {notif.message}
                          {isInvitation && (
                            <span className="np-item-action-hint">
                              <FiExternalLink size={12} />
                              Cliquer pour répondre
                            </span>
                          )}
                        </p>
                        <span className="np-item-time">{timeAgo(notif.createdAt)}</span>
                      </div>

                      <div className="np-item-actions">
                        {!notif.read && (
                          <button
                            className="np-action-btn"
                            onClick={(e) => { e.stopPropagation(); dispatch(markAsRead(notif.id)); }}
                            title="Marquer comme lu"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          className="np-action-btn"
                          onClick={(e) => handleRemove(e, notif.id)}
                          title="Supprimer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      {!notif.read && <div className="np-item-dot" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        document.body // <-- C'est ici que la magie opère
      )}

      {/* ── Modal d'acceptation d'invitation ── */}
      {selectedInvitation && (
        <InvitationAcceptModal
          invitation={selectedInvitation}
          onClose={() => setSelectedInvitation(null)}
          onResponded={handleInvitationResponded}
        />
      )}
    </>
  );
}