/* ========================================
   Page Solutions — Par équipe et par usage
   ======================================== */

import { Link } from 'react-router-dom';
import {
  FiCode,
  FiPenTool,
  FiTarget,
  FiUsers,
  FiSettings,
  FiArrowRight,
  FiCheckCircle,
  FiBriefcase,
  FiTrello,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './SolutionsPage.css';

/* ── Solutions par équipe ── */
const TEAM_SOLUTIONS = [
  {
    icon: <FiCode size={24} />,
    title: 'Équipes Engineering',
    desc: 'Gérez sprints, backlogs et deploys avec des workflows adaptés au développement agile.',
    features: [
      'Intégration GitHub / GitLab',
      'Sprints et velocity tracking',
      'Liens PR automatiques',
      'Review boards',
    ],
    image: 'https://images.unsplash.com/photo-1605868587355-5acbe10a8fab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8JUMzJTg5cXVpcGVzJTIwRW5naW5lZXJpbmclMjBHJUMzJUE5cmV6JTIwc3ByaW50cyUyQyUyMGJhY2tsb2dzJTIwZXQlMjBkZXBsb3lzJTIwYXZlYyUyMGRlcyUyMHdvcmtmbG93cyUyMGFkYXB0JUMzJUE5cyUyMGF1JTIwZCVDMyVBOXZlbG9wcGVtZW50JTIwYWdpbGUufGVufDB8fDB8fHww',
    color: 'var(--primary)',
    bg: 'var(--primary-light)',
  },
  {
    icon: <FiPenTool size={24} />,
    title: 'Équipes Design',
    desc: 'Centralisez les demandes, gérez les feedbacks et suivez la progression des maquettes.',
    features: [
      'Previews Figma intégrées',
      'Feedback visuel',
      'Workflow de validation',
      'Bibliothèque d\'assets',
    ],
    image: 'https://images.unsplash.com/photo-1574556132185-5f4a6ffa80c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUMzJTg5cXVpcGVzJTIwRGVzaWduJTIwQ2VudHJhbGlzZXolMjBsZXMlMjBkZW1hbmRlcyUyQyUyMGclQzMlQTlyZXolMjBsZXMlMjBmZWVkYmFja3MlMjBldCUyMHN1aXZleiUyMGxhJTIwcHJvZ3Jlc3Npb24lMjBkZXMlMjBtYXF1ZXR0ZXMufGVufDB8fDB8fHww',
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
  },
  {
    icon: <FiTarget size={24} />,
    title: 'Équipes Marketing',
    desc: 'Planifiez campagnes, calendrier éditorial et lancements avec une visibilité totale.',
    features: [
      'Calendrier éditorial',
      'Workflow d\'approbation',
      'Suivi KPIs',
      'Templates campagnes',
    ],
    image: 'https://media.istockphoto.com/id/2200058628/fr/photo/des-professionnels-du-marketing-collaborent-sur-un-projet-dans-un-bureau-moderne.webp?a=1&b=1&s=612x612&w=0&k=20&c=cdi3_2rZXm-EsyKxl3JlWsSKNKRQ5H__5LitACABTSI=',
    color: 'var(--success)',
    bg: 'var(--success-light)',
  },
  {
    icon: <FiBriefcase size={24} />,
    title: 'Équipes Opérations',
    desc: 'Standardisez les processus, suivez les tickets et automatisez les tâches récurrentes.',
    features: [
      'SLA tracking',
      'Automatisation escalades',
      'Rapports automatisés',
      'Knowledge base',
    ],
    image: 'https://plus.unsplash.com/premium_photo-1770303664796-be0f57b93169?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUMzJTg5cXVpcGVzJTIwT3AlQzMlQTlyYXRpb25zJTIwU3RhbmRhcmRpc2V6JTIwbGVzJTIwcHJvY2Vzc3VzJTJDJTIwc3VpdmV6JTIwbGVzJTIwdGlja2V0cyUyMGV0JTIwYXV0b21hdGlzZXolMjBsZXMlMjB0JUMzJUEyY2hlcyUyMHIlQzMlQTljdXJyZW50ZXMufGVufDB8fDB8fHww',
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
];

/* ── Cas d'usage ── */
const USE_CASES = [
  {
    title: 'Gestion de projet',
    desc: 'Planifiez, organisez et suivez vos projets de A à Z.',
    icon: '📋',
  },
  {
    title: 'Suivi de bugs',
    desc: 'Signalez, assignez et résolvez les bugs efficacement.',
    icon: '🐛',
  },
  {
    title: 'Onboarding',
    desc: 'Créez des parcours d\'intégration structurés pour les nouveaux.',
    icon: '🚀',
  },
  {
    title: 'Planning de contenu',
    desc: 'Organisez votre calendrier éditorial et vos publications.',
    icon: '📝',
  },
  {
    title: 'Gestion des tâches',
    desc: 'Priorisez et déléguez les tâches quotidiennes.',
    icon: '✅',
  },
  {
    title: 'Réunions & comptes-rendus',
    desc: 'Structurez vos réunions et suivez les actions.',
    icon: '🤝',
  },
];

/* ── Rôles ── */
const ROLES = [
  {
    title: 'Administrateurs',
    desc: 'Contrôle total sur l\'organisation, la sécurité et les paramètres globaux.',
    features: [
      'Gestion des membres et rôles',
      'Configuration sécurité (2FA, SSO)',
      'Journal d\'audit complet',
      'Gestion des licences',
      'Paramètres organisation',
    ],
    color: 'var(--primary)',
    bg: 'var(--primary-light)',
  },
  {
    title: 'Managers',
    desc: 'Pilotage des projets, suivi des équipes et automatisation des workflows.',
    features: [
      'Création et gestion de projets',
      'Assignation et suivi des tâches',
      'Rapports de progression',
      'Automatisation des workflows',
      'Gestion des échéances',
    ],
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
    featured: true,
  },
  {
    title: 'Membres',
    desc: 'Exécution des tâches, collaboration et mise à jour des statuts.',
    features: [
      'Vue des tâches assignées',
      'Mise à jour des statuts',
      'Commentaires et mentions',
      'Partage de fichiers',
      'Notifications personnalisées',
    ],
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
];

export default function SolutionsPage() {
  return (
    <div className="sp-page">
      <LandingHeader />

      {/* ════════ EN-TÊTE ════════ */}
      <section className="sp-hero">
        <div className="sp-hero-container">
          <span className="badge badge-primary">Solutions</span>
          <h1 className="sp-hero-title">
            Un outil de productivité<br />
            <span className="sp-hero-accent">adapté à chaque équipe</span>
          </h1>
          <p className="sp-hero-subtitle">
            Que vous gériez une équipe de développement, une cellule marketing
            ou vos tâches personnelles, ProjetFlow s'adapte à vos besoins.
          </p>
        </div>
      </section>

      {/* ════════ SOLUTIONS PAR ÉQUIPE ════════ */}
      <section className="sp-teams">
        <div className="sp-teams-container">
          <h2 className="sp-section-title">Solutions par équipe</h2>
          <p className="sp-section-subtitle">
            Des workflows préconfigurés pour chaque type d'équipe.
          </p>

          <div className="sp-teams-grid">
            {TEAM_SOLUTIONS.map((sol) => (
              <div key={sol.title} className="sp-team-card">
                {/* Image */}
                <div className="sp-team-image-wrapper">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="sp-team-image"
                    loading="lazy"
                  />
                  <div
                    className="sp-team-icon"
                    style={{ background: sol.bg, color: sol.color }}
                  >
                    {sol.icon}
                  </div>
                </div>

                {/* Contenu */}
                <div className="sp-team-content">
                  <h3 className="sp-team-title">{sol.title}</h3>
                  <p className="sp-team-desc">{sol.desc}</p>

                  <ul className="sp-team-features">
                    {sol.features.map((f) => (
                      <li key={f} className="sp-team-feature">
                        <FiCheckCircle size={14} style={{ color: sol.color }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/features" className="sp-team-link">
                    En savoir plus
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CAS D'USAGE ════════ */}
      <section className="sp-usecases">
        <div className="sp-usecases-container">
          <h2 className="sp-section-title">Cas d'usage</h2>
          <p className="sp-section-subtitle">
            ProjetFlow s'adapte à tous vos besoins de gestion.
          </p>

          <div className="sp-usecases-grid">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="sp-usecase-card">
                <span className="sp-usecase-icon">{uc.icon}</span>
                <div className="sp-usecase-text">
                  <h3 className="sp-usecase-title">{uc.title}</h3>
                  <p className="sp-usecase-desc">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ RÔLES ════════ */}
      <section className="sp-roles">
        <div className="sp-roles-container">
          <h2 className="sp-section-title">Adapté à chaque rôle</h2>
          <p className="sp-section-subtitle">
            Chaque membre dispose d'une interface et de fonctionnalités adaptées à ses responsabilités.
          </p>

          <div className="sp-roles-grid">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className={`sp-role-card ${role.featured ? 'sp-role-featured' : ''}`}
              >
                {role.featured && (
                  <div className="sp-role-badge">Le plus utilisé</div>
                )}

                <div
                  className="sp-role-header"
                  style={{ borderBottomColor: role.bg }}
                >
                  <h3 className="sp-role-title">{role.title}</h3>
                  <p className="sp-role-desc">{role.desc}</p>
                </div>

                <ul className="sp-role-features">
                  {role.features.map((f) => (
                    <li key={f} className="sp-role-feature">
                      <FiCheckCircle size={15} style={{ color: role.color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`btn ${role.featured ? 'btn-primary' : 'btn-secondary'} sp-role-cta`}
                >
                  Découvrir
                  <FiArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="sp-bottom">
        <div className="sp-bottom-container">
          <h2>Prêt à essayer ProjetFlow avec votre équipe ?</h2>
          <p>
            Créez votre espace gratuit en moins de 2 minutes.
            Aucune carte bancaire requise.
          </p>
          <div className="sp-bottom-actions">
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



