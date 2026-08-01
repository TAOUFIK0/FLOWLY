/* ========================================
   MembersPanel — Liste des membres + bouton inviter
   ======================================== */

import { useState, useEffect } from 'react';
import {
  FiUser,
  FiShield,
  FiStar,
  FiPlus,
  FiMoreVertical,
} from 'react-icons/fi';
import InviteMemberModal from './InviteMemberModal';
import { projectsApi } from '../api';
import './MembersPanel.css';

/* Icône selon le rôle */
function RoleIcon({ role }) {
  switch (role) {
    case 'OWNER':  return <FiStar size={14} className="mp-role-owner" />;
    case 'MANAGER': return <FiShield size={14} className="mp-role-manager" />;
    default:      return <FiUser size={14} className="mp-role-member" />;
  }
}

/* Label traduit */
function RoleLabel({ role }) {
  switch (role) {
    case 'OWNER':  return <span className="mp-badge mp-badge-owner">Owner</span>;
    case 'MANAGER': return <span className="mp-badge mp-badge-manager">Manager</span>;
    default:      return <span className="mp-badge mp-badge-member">Membre</span>;
  }
}

export default function MembersPanel({ projectId, currentUserRole }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const canInvite = currentUserRole === 'OWNER' || currentUserRole === 'MANAGER';

  /* Charger les membres */
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    projectsApi
      .getMembers(projectId)
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  /* Fermer le menu au clic extérieur */
  useEffect(() => {
    if (!openMenu) return;
    const handleClick = () => setOpenMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openMenu]);

  const handleInvited = () => {
    /* Recharger la liste après invitation */
    projectsApi
      .getMembers(projectId)
      .then((res) => setMembers(res.data))
      .catch(() => {});
  };

  /* Initiales */
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  /* ── NOUVELLE FONCTION : Promouvoir ou rétrograder un membre ── */
  const handlePromote = async (targetUserId, newRole) => {
    setOpenMenu(null); // Ferme le menu
    try {
      // Appel de l'API qu'on a ajouté dans api.js
      await projectsApi.updateMemberRole(projectId, targetUserId, newRole);
      
      // On recharge la liste des membres pour afficher le nouveau rôle en temps réel
      const res = await projectsApi.getMembers(projectId);
      setMembers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du changement de rôle");
    }
  };

  return (
    <>
      <div className="mp-panel">
        {/* Header */}
        <div className="mp-header">
          <h3 className="mp-title">
            Membres
            <span className="mp-count">{members.length}</span>
          </h3>
          {canInvite && (
            <button className="mp-invite-btn" onClick={() => setShowInvite(true)}>
              <FiPlus size={16} />
              Inviter
            </button>
          )}
        </div>

        {/* Liste */}
        <div className="mp-list">
          {loading ? (
            <div className="mp-loading">
              <div className="spinner" />
            </div>
          ) : members.length === 0 ? (
            <div className="mp-empty">
              <span>Aucun membre</span>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.userId} className="mp-member">
                <div className="mp-member-avatar">
                  {getInitials(member.name)}
                </div>
                <div className="mp-member-info">
                  <span className="mp-member-name">
                    {member.name}
                    {member.isCurrentUser && (
                      <span className="mp-you">(vous)</span>
                    )}
                  </span>
                  <div className="mp-member-role">
                    <RoleIcon role={member.role} />
                    <RoleLabel role={member.role} />
                  </div>
                </div>

                {/* --- Menu pour promouvoir (Uniquement pour le OWNER) --- */}
                {currentUserRole === 'OWNER' && member.role !== 'OWNER' && (
                  <div className="mp-member-actions">
                    <button 
                      className="mp-menu-btn" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenMenu(openMenu === member.userId ? null : member.userId); 
                      }}
                    >
                      <FiMoreVertical size={16} />
                    </button>
                    
                    {openMenu === member.userId && (
                      <div className="mp-dropdown-menu">
                        {member.role === 'MEMBER' && (
                          <button 
                            onClick={() => handlePromote(member.userId, 'MANAGER')}
                            className="mp-dropdown-item"
                          >
                            <FiShield size={14} /> Promouvoir en Manager
                          </button>
                        )}
                        {member.role === 'MANAGER' && (
                          <button 
                            onClick={() => handlePromote(member.userId, 'MEMBER')}
                            className="mp-dropdown-item"
                          >
                            <FiUser size={14} /> Rétrograder en Membre
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'invitation */}
      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
          onInvited={handleInvited}
        />
      )}
    </>
  );
}

