/* ========================================
   Page Comment ça marche — Guide pas à pas
   ======================================== */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiLayout,
  FiPlusCircle,
  FiUsers,
  FiLink2,
  FiMessageSquare,
  FiEye,
  FiZap,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiBookOpen,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './HowItWorksPage.css';

/* ── Données des étapes ── */
const STEPS = [
  {
    id: 1,
    icon: <FiLayout size={20} />,
    title: 'Maîtrisez les bases du tableau',
    description:
      'Comprenez comment fonctionnent les colonnes, les cartes et les listes. Apprenez à déplacer, organiser et prioriser vos tâches visuellement.',
    tips: [
      'Créer une colonne pour chaque phase du projet',
      'Glisser-déposer pour changer le statut',
      'Ajouter des labels et des échéances',
    ],
  },
  {
    id: 2,
    icon: <FiPlusCircle size={20} />,
    title: 'Créez votre premier projet',
    description:
      "Partez d'un modèle ou commencez de zéro. Définissez vos colonnes, ajoutez vos premières cartes et structurez votre workflow.",
    tips: [
      'Choisir un template adapté à votre métier',
      'Définir les colonnes clés (À faire, En cours, Terminé)',
      'Inviter des collaborateurs',
    ],
  },
  {
    id: 3,
    icon: <FiUsers size={20} />,
    title: 'Onboardez votre équipe',
    description:
      'Invitez vos collaborateurs, attribuez des rôles (Admin, Manager, Membre) et configurez les permissions pour chaque membre.',
    tips: [
      'Invitation par e-mail ou lien partagé',
      '3 niveaux de rôles prédéfinis',
      'Permissions granulaires par tableau',
    ],
  },
  {
    id: 4,
    icon: <FiLink2 size={20} />,
    title: 'Intégrez vos outils existants',
    description:
      'Connectez ProjetFlow à Slack, GitHub, Figma et plus de 50 outils. Synchronisez automatiquement les données entre vos plateformes.',
    tips: [
      'Connexion Slack pour les notifications',
      'Lien GitHub pour les PR et commits',
      'Webhooks personnalisés',
    ],
  },
  {
    id: 5,
    icon: <FiMessageSquare size={20} />,
    title: 'Collaborez en temps réel',
    description:
      'Commentez les cartes, mentionnez vos collègues, partagez des fichiers. La communication reste centralisée sur chaque tâche.',
    tips: [
      'Commentaires threadés par carte',
      'Mentions @utilisateur pour alerter',
      'Pièces jointes directement dans les cartes',
    ],
    isNew: true,
  },
  {
    id: 6,
    icon: <FiEye size={20} />,
    title: 'Activez les vues multiples',
    description:
      'Basculez entre la vue Kanban, calendrier, timeline et liste. Chaque membre peut choisir la vue qui lui convient.',
    tips: [
      'Kanban : vue par colonnes',
      'Calendrier : vue par dates',
      'Timeline : vue Gantt des échéances',
    ],
  },
  {
    id: 7,
    icon: <FiZap size={20} />,
    title: 'Automatisez vos tâches',
    description:
      'Créez des règles sans code : déplacement automatique, assignation par statut, rappels avant échéance. Le bot gère la routine.',
    tips: [
      'Règles IF / THEN personnalisables',
      'Rappels automatiques avant échéance',
      'Déclencheurs sur création ou déplacement',
    ],
  },
  {
    id: 8,
    icon: <FiShield size={20} />,
    title: 'Configurez la sécurité',
    description:
      "Gérez les accès, l'historique des actions, l'export de données. Assurez la conformité et la traçabilité de vos projets.",
    tips: [
      "Journal d'audit complet",
      'Export CSV / PDF des données',
      'Authentification 2FA disponible',
    ],
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);
  const activeData = STEPS.find((s) => s.id === activeStep);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove('hiw-fade-in');
      void contentRef.current.offsetWidth; // Force reflow
      contentRef.current.classList.add('hiw-fade-in');
    }
  }, [activeStep]);

  /* Progression en pourcentage */
  const progress = (activeStep / STEPS.length) * 100;

  return (
    <div className="hiw-page">
      <LandingHeader />

      {/* ════════ EN-TÊTE (HERO) ════════ */}
      <section className="hiw-hero">
        <div className="hiw-hero-container">
          <span className="badge badge-primary">Guide</span>
          <h1 className="hiw-hero-title">
            Démarrez avec ProjetFlow<br />
            <span className="hiw-hero-accent">en 8 étapes simples</span>
          </h1>
          <p className="hiw-hero-subtitle">
            Suivez ce guide pas à pas pour maîtriser toutes les fonctionnalités
            de la plateforme et devenir autonome en quelques minutes.
          </p>
        </div>
      </section>

      {/* ════════ CORPS (Sidebar + Contenu) ════════ */}
      <section className="hiw-main">
        <div className="hiw-main-container">
          {/* Sidebar — liste des chapitres */}
          <aside className="hiw-sidebar">
            {/* Barre de progression */}
            <div className="hiw-progress">
              <div className="hiw-progress-bar" style={{ width: `${progress}%` }} />
              <span className="hiw-progress-label">
                Étape {activeStep} / {STEPS.length}
              </span>
            </div>

            <ul className="hiw-step-list">
              {STEPS.map((step) => (
                <li key={step.id}>
                  <button
                    className={`hiw-step-item ${activeStep === step.id ? 'hiw-step-active' : ''}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <span className="hiw-step-number">
                      {activeStep > step.id ? (
                        <FiCheckCircle size={16} />
                      ) : (
                        step.id
                      )}
                    </span>
                    <span className="hiw-step-icon">{step.icon}</span>
                    <span className="hiw-step-label">{step.title}</span>
                    {step.isNew && <span className="hiw-step-badge">Nouveau</span>}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Contenu de l'étape */}
          <div className="hiw-content" ref={contentRef}>
            {activeData && (
              <div className="hiw-card">
                {/* Numéro de chapitre */}
                <div className="hiw-chapter-tag">
                  <FiBookOpen size={14} />
                  CHAPITRE {activeData.id}
                </div>

                {/* Icone + titre */}
                <div className="hiw-card-header">
                  <div className="hiw-card-icon">{activeData.icon}</div>
                  <h2 className="hiw-card-title">{activeData.title}</h2>
                </div>

                {/* Description */}
                <p className="hiw-card-desc">{activeData.description}</p>

                {/* Conseils */}
                <div className="hiw-tips">
                  <h4 className="hiw-tips-title">Ce que vous allez apprendre :</h4>
                  <ul className="hiw-tips-list">
                    {activeData.tips.map((tip, i) => (
                      <li key={i} className="hiw-tip-item">
                        <FiCheckCircle size={16} className="hiw-tip-check" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation entre étapes */}
                <div className="hiw-nav-buttons">
                  <button
                    className="btn btn-secondary"
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep((s) => s - 1)}
                  >
                    Précédent
                  </button>
                  {activeStep < STEPS.length ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setActiveStep((s) => s + 1)}
                    >
                      Étape suivante
                      <FiArrowRight size={16} />
                    </button>
                  ) : (
                    <Link to="/register" className="btn btn-accent">
                      Commencer maintenant
                      <FiArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="hiw-bottom">
        <div className="hiw-bottom-container">
          <h2>Prêt à passer à l'action ?</h2>
          <p>
            Créez votre espace gratuit en moins de 2 minutes et suivez ces étapes directement dans l'application.
          </p>
          <div className="hiw-bottom-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Commencer gratuitement
              <FiArrowRight size={18} />
            </Link>
            <Link to="/features" className="btn btn-secondary btn-lg">
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}


