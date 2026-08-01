/* ========================================
   Page Fonctionnalités — Vue détaillée
   ======================================== */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInbox,
  FiCalendar,
  FiZap,
  FiLayers,
  FiCopy,
  FiLink2,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './FeaturesPage.css';

/* ── Données des fonctionnalités ── */
const FEATURES = [
  {
    id: 'inbox',
    icon: <FiInbox size={22} />,
    label: 'Inbox',
    title: 'Centralisez vos tâches entrantes',
    description:
      "Importez les détails depuis vos e-mails, Slack ou tout autre canal. Transformez n'importe quel message en carte actionnable en un clic.",
    image: 'https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3JnYW5pemUlMjB3b3JrfGVufDB8fDB8fHww',
    highlights: ['Import e-mail automatique', 'Capture rapide Slack', 'Conversion en carte instantanée'],
  },
  {
    id: 'planner',
    icon: <FiCalendar size={22} />,
    label: 'Planner',
    title: 'Synchronisez votre calendrier',
    description:
      'Visualisez vos échéances directement sur un calendrier interactif. Planifiez, réassignez et ajustez les dates en glisser-déposer.',
    image: 'https://media.istockphoto.com/id/1384447558/fr/photo/femme-utilisant-lapplication-de-calendrier-sur-un-ordinateur-de-bureau.webp?a=1&b=1&s=612x612&w=0&k=20&c=nF-3CoDzydKBU04hHcz2AuJHPLj-Amb4PevgQ_UHAE4=',
    highlights: ['Vue calendrier intégrée', 'Glisser-déposer de dates', 'Sync Google / Outlook'],
  },
  {
    id: 'automation',
    icon: <FiZap size={22} />,
    label: 'Automation',
    title: 'Automatisez sans coder',
    description:
      'Créez des règles déclenchées par des événements : déplacement automatique, assignation, notifications. Le bot fait le travail, vous gardez le focus.',
    image: 'https://images.unsplash.com/photo-1654588834013-29984d2238de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF1dG9tYXRpc2F0aW9uJTIwZGVzJTIwdGFjaGVzJTIwc2FucyUyMGNvZGVyfGVufDB8fDB8fHww',
    highlights: ['Règles conditionnelles', 'Déclencheurs personnalisés', 'Aucun code requis'],
  },
  {
    id: 'powerups',
    icon: <FiLayers size={22} />,
    label: 'Power-Ups',
    title: 'Étendez les capacités',
    description:
      'Ajoutez des fonctionnalités sur mesure grâce aux Power-Ups : diagrammes Gantt, suivi du temps, champs personnalisés et bien plus.',
    image: 'https://images.unsplash.com/photo-1681164315362-af89775190a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG93ZXJ1cHMlMjBza2lsbHN8ZW58MHx8MHx8fDA%3D',
    highlights: ['Plus de 200 Power-Ups', 'Champs personnalisés', 'Gantt & chronogrammes'],
  },
  {
    id: 'templates',
    icon: <FiCopy size={22} />,
    label: 'Templates',
    title: 'Partez de modèles éprouvés',
    description:
      "Gagnez du temps avec des templates conçus pour les use cases les plus courants : gestion de projet, sprint agile, onboarding…",
    image: 'https://plus.unsplash.com/premium_photo-1682126266861-c25d9bdc9678?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2VzdGlvbiUyMGRlcyUyMHRhY2hlcyUyMHBjfGVufDB8fDB8fHww',
    highlights: ["50+ templates prêts à l'emploi", 'Templates personnalisables', "Partage d'équipe"],
  },
  {
    id: 'integrations',
    icon: <FiLink2 size={22} />,
    label: 'Intégrations',
    title: 'Connectez vos outils existants',
    description:
      'Reliez ProjetFlow à votre écosystème : GitHub, GitLab, Figma, Slack, Microsoft Teams. Toutes vos données synchronisées.',
    image: 'https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZWdyYXRpb24lMjRkJTIwb3JkaW5hdGV1ciUyMENvbm5lY3RleiUyMHZvcyUyMG91dGlscyUyMGV4aXN0YW50c3xlbnwwfHwwfHx8MA%3D%3D',
    highlights: ['GitHub & GitLab', 'Slack & Teams', 'Figma & Adobe XD'],
  },
];

export default function FeaturesPage() {
  const [activeId, setActiveId] = useState('inbox');
  const activeFeature = FEATURES.find((f) => f.id === activeId);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove('fp-fade-in-up');
      // Force le reflow pour relancer l'animation CSS
      void contentRef.current.offsetWidth; 
      contentRef.current.classList.add('fp-fade-in-up');
    }
  }, [activeId]);

  return (
    <div className="fp-page">
      <LandingHeader />

      {/* ════════ EN-TÊTE (HERO) ════════ */}
      <section className="fp-hero">
        <div className="fp-hero-container">
          <span className="badge badge-primary">Fonctionnalités</span>
          <h1 className="fp-hero-title">
            Tout ce dont vous avez besoin<br />
            <span className="fp-hero-accent">pour gagner en productivité</span>
          </h1>
          <p className="fp-hero-subtitle">
            Découvrez les outils puissants de ProjetFlow pour organiser, automatiser et synchroniser vos projets.
          </p>
        </div>
      </section>

      {/* ════════ CORPS (Sidebar + Détail) ════════ */}
      <section className="fp-body">
        {/* Sidebar */}
        <nav className="fp-sidebar">
          <ul className="fp-nav-list">
            {FEATURES.map((feature) => (
              <li key={feature.id}>
                <button
                  className={`fp-nav-item ${activeId === feature.id ? 'fp-nav-active' : ''}`}
                  onClick={() => setActiveId(feature.id)}
                >
                  <span className="fp-nav-icon">{feature.icon}</span>
                  <span className="fp-nav-label">{feature.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenu dynamique */}
        <div className="fp-content" ref={contentRef}>
          {activeFeature && (
            <>
              <div className="fp-image-wrapper">
                <img
                  src={activeFeature.image}
                  alt={activeFeature.label}
                  className="fp-image"
                  loading="lazy"
                />
              </div>

              <div className="fp-text">
                <div className="fp-text-icon">{activeFeature.icon}</div>
                <h2 className="fp-text-title">{activeFeature.title}</h2>
                <p className="fp-text-desc">{activeFeature.description}</p>

                <ul className="fp-highlights">
                  {activeFeature.highlights.map((h, i) => (
                    <li key={i} className="fp-highlight-item">
                      <FiCheck size={16} className="fp-highlight-check" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn btn-primary">
                  Découvrir {activeFeature.label}
                  <FiArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="fp-bottom">
        <div className="fp-bottom-container">
          <h2>Prêt à transformer votre façon de travailler ?</h2>
          <p>Rejoignez des milliers d'équipes qui ont déjà adopté ProjetFlow.</p>
          <div className="fp-bottom-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Commencer gratuitement
              <FiArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="btn btn-secondary btn-lg">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}


