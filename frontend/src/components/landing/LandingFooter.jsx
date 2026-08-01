/* ========================================
   Footer Landing — Réutilisable
   ======================================== */

import { Link } from 'react-router-dom';
import './LandingFooter.css';

const FOOTER_LINKS = [
  {
    title: 'Produit',
    links: [
      { label: 'Fonctionnalités', href: '/features' },
      { label: 'Tarifs', href: '/pricing' },
      { label: 'Intégrations', href: '/features' },
      { label: 'Mises à jour', href: '/resources' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Guide de démarrage', href: '/how-it-works' },
      { label: 'Templates', href: '/features' },
      { label: 'Blog', href: '/resources' },
      { label: 'Centre d\'aide', href: '/resources' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '/resources' },
      { label: 'Carrières', href: '/resources' },
      { label: 'Contact', href: '/resources' },
      { label: 'Partenaires', href: '/resources' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Confidentialité', href: '/resources' },
      { label: 'Conditions', href: '/resources' },
      { label: 'Sécurité', href: '/resources' },
      { label: 'Cookies', href: '/resources' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="lf-footer">
      <div className="lf-container">

        {/* Top : logo + colonnes */}
        <div className="lf-top">
          {/* Logo */}
          <div className="lf-brand">
            <Link to="/" className="lf-logo">
              <div className="lf-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="1" width="10" height="10" rx="2" fill="currentColor" />
                  <rect x="13" y="1" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
                  <rect x="1" y="13" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
                  <rect x="13" y="13" width="10" height="10" rx="2" fill="currentColor" opacity="0.3" />
                </svg>
              </div>
              <span className="lf-logo-text">ProjetFlow</span>
            </Link>
            <p className="lf-brand-desc">
              La plateforme de gestion de projets conçue pour les équipes qui veulent faire mieux, ensemble.
            </p>
          </div>

          {/* Colonnes de liens */}
          <div className="lf-columns">
            {FOOTER_LINKS.map((col) => (
              <div key={col.title} className="lf-column">
                <h4 className="lf-column-title">{col.title}</h4>
                <ul className="lf-column-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="lf-column-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="lf-separator" />

        {/* Bottom : copyright */}
        <div className="lf-bottom">
          <span className="lf-copyright">
            &copy; {new Date().getFullYear()} ProjetFlow. Projet inspiré de Trello.
          </span>
          <div className="lf-bottom-links">
            <Link to="/resources">Confidentialité</Link>
            <Link to="/resources">Conditions</Link>
            <Link to="/resources">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

