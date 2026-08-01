/* ========================================
   Sidebar — Navigation workspace
   ======================================== */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiFolder, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiUsers, FiInbox, FiCalendar } from 'react-icons/fi';
import { logout } from '../auth/authSlice';
import NotificationPanel from '../notifications/NotificationPanel';
import FlowlyLogo from '../../components/common/FlowlyLogo'; // AJOUTÉ pour le logo FLOWLY
import './Sidebar.css';

const MENU_ITEMS = [
  { icon: <FiHome size={18} />, label: 'Tableau de bord', path: '/workspace' },
  { icon: <FiFolder size={18} />, label: 'Mes projets', path: '/projects' },
  { icon: <FiInbox size={18} />, label: 'Inbox', path: '/inbox' },
  { icon: <FiCalendar size={18} />, label: 'Planifier', path: '/planner' }, // AJOUTÉ
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  /* Rôle traduit */
  const roleMap = { ADMIN: 'Administrateur', MANAGER: 'Manager', MEMBER: 'Membre' };
  const roleLabel = roleMap[user?.role] || user?.role || 'Membre';

  /* Initiales de l'utilisateur */
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <aside className={`sb-sidebar ${collapsed ? 'sb-collapsed' : ''}`}>
      {/* ── Logo (Mis à jour avec FLOWLY) ── */}
      <div className="sb-top">
        <div className="sb-logo" onClick={() => navigate('/workspace')}>
          <FlowlyLogo size={28} />
          {!collapsed && <span className="sb-logo-text" style={{fontWeight: 800, letterSpacing: '-0.02em'}}>FLOWLY</span>}
        </div>
      </div>

      {/* ── Menu ── */}
      <nav className="sb-menu">
        <ul className="sb-menu-list">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                className={`sb-menu-item ${isActive(item.path) ? 'sb-menu-active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <span className="sb-menu-icon">{item.icon}</span>
                {!collapsed && <span className="sb-menu-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bas du sidebar ── */}
      <div className="sb-bottom">
        {/* Notifications */}
        <div className="sb-notifications">
          <NotificationPanel />
        </div>

        {/* Profil utilisateur */}
        <div className="sb-user">
          <div className="sb-user-avatar">{initials}</div>
          {!collapsed && (
            <div className="sb-user-info">
             <span className="sb-user-name">{user?.name || user?.firstName || user?.username || user?.email || 'Utilisateur'}</span> 
              <span className="sb-user-role">{roleLabel}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sb-actions">
          <button
            className="sb-action-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
          >
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            {!collapsed && <span>Réduire</span>}
          </button>
          <button className="sb-action-btn sb-action-logout" onClick={handleLogout}>
            <FiLogOut size={16} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}