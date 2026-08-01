/* ========================================
   Header Landing — Navbar publique
   ======================================== */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiChevronDown,
  FiX,
  FiMenu,
  FiArrowRight,
} from 'react-icons/fi';
import './LandingHeader.css';

/* ── Liens de navigation ── */
const NAV_LINKS = [
  {
    label: 'Fonctionnalités',
    href: '/features',
    submenu: [
      { label: 'Inbox', href: '/features', hash: '#inbox' },
      { label: 'Planner', href: '/features', hash: '#planner' },
      { label: 'Automation', href: '/features', hash: '#automation' },
      { label: 'Power-Ups', href: '/features', hash: '#powerups' },
      { label: 'Templates', href: '/features', hash: '#templates' },
      { label: 'Intégrations', href: '/features', hash: '#integrations' },
    ],
  },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Comment ça marche', href: '/how-it-works' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Ressources', href: '/resources' },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const headerRef = useRef(null);

  /* Détecter le scroll pour le fond du header */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Fermer le menu mobile au changement de page */
  useEffect(() => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  }, [location.pathname]);

  /* Fermer le menu en cliquant à l'extérieur */
  useEffect(() => {
    const handleClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  /* Empêcher le scroll du body quand le menu mobile est ouvert */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Toggle un sous-menu desktop */
  const toggleSubmenu = (label, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  /* Toggle un sous-menu mobile */
  const toggleMobileSubmenu = (label) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  return (
    <header
      ref={headerRef}
      className={`lh-header ${scrolled ? 'lh-scrolled' : ''}`}
    >
      <div className="lh-container">

        {/* ── Logo ── */}
        <Link to="/" className="lh-logo" onClick={() => setOpenSubmenu(null)}>
          <div className="lh-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="2" fill="currentColor" />
              <rect x="13" y="1" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
              <rect x="1" y="13" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
              <rect x="13" y="13" width="10" height="10" rx="2" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <span className="lh-logo-text">FLOWLY</span>
        </Link>

        {/* ── Navigation desktop ── */}
        <nav className="lh-nav-desktop">
          {NAV_LINKS.map((link) =>
            link.submenu ? (
              <div
                key={link.label}
                className={`lh-nav-item ${openSubmenu === link.label ? 'lh-submenu-open' : ''}`}
              >
                <button
                  className="lh-nav-link"
                  onClick={(e) => toggleSubmenu(link.label, e)}
                >
                  {link.label}
                  <FiChevronDown
                    size={14}
                    className="lh-nav-chevron"
                  />
                </button>

                {/* Sous-menu dropdown */}
                <div className="lh-submenu">
                  <div className="lh-submenu-inner">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={`${sub.href}${sub.hash || ''}`}
                        className="lh-submenu-link"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`lh-nav-link ${
                  location.pathname === link.href ? 'lh-nav-active' : ''
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* ── Actions desktop ── */}
        <div className="lh-actions">
          <Link to="/login" className="lh-action-link">
            Se connecter
          </Link>
          <Link to="/register" className="btn btn-primary lh-cta">
            Commencer gratuitement
          </Link>
        </div>

        {/* ── Bouton hamburger mobile ── */}
        <button
          className="lh-burger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ── Menu mobile (overlay) ── */}
      <div className={`lh-mobile ${mobileOpen ? 'lh-mobile-open' : ''}`}>
        <nav className="lh-mobile-nav">
          {NAV_LINKS.map((link) =>
            link.submenu ? (
              <div key={link.label} className="lh-mobile-group">
                <button
                  className="lh-mobile-link"
                  onClick={() => toggleMobileSubmenu(link.label)}
                >
                  {link.label}
                  <FiChevronDown
                    size={14}
                    className={`lh-mobile-chevron ${openSubmenu === link.label ? 'lh-mobile-chevron-open' : ''}`}
                  />
                </button>
                <div
                  className={`lh-mobile-submenu ${openSubmenu === link.label ? 'lh-mobile-submenu-open' : ''}`}
                >
                  {link.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      to={`${sub.href}${sub.hash || ''}`}
                      className="lh-mobile-sublink"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`lh-mobile-link ${location.pathname === link.href ? 'lh-nav-active' : ''}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="lh-mobile-actions">
          <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMobileOpen(false)}>
            Se connecter
          </Link>
          <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>
            Commencer gratuitement
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

