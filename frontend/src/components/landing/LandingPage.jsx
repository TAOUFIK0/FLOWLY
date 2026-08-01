/* ========================================
   Landing Page — Page d'accueil (/)
   ======================================== */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiPlay,
  FiLayout,
  FiZap,
  FiUsers,
  FiCheckCircle,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './LandingPage.css';

/* ── Données de l'aperçu features ── */
const PREVIEW_FEATURES = [
  {
    icon: <FiLayout size={22} />,
    title: 'Tableaux Kanban',
    desc: 'Organisez visuellement vos tâches avec des colonnes et des cartes glissantes.',
  },
  {
    icon: <FiZap size={22} />,
    title: 'Automatisation',
    desc: 'Créez des règles sans code pour éliminer les tâches répétitives.',
  },
  {
    icon: <FiUsers size={22} />,
    title: 'Collaboration',
    desc: 'Commentez, mentionnez et partagez des fichiers en temps réel.',
  },
];

/* ── Données des stats ── */
const STATS = [
  { value: '50k+', label: 'Équipes actives' },
  { value: '2M+', label: 'Tâches terminées' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '4.8/5', label: 'Note moyenne' },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/register?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div className="lp-page">
      <LandingHeader />

      {/* ════════ HERO ════════ */}
      <section className="lp-hero">
        <div className="lp-hero-container">

          {/* Côté texte */}
          <div className="lp-hero-text lp-anim-up">
            <h1 className="lp-hero-title">
              Capturez, organisez et gérez vos tâches de partout.
            </h1>
            <p className="lp-hero-subtitle">
              Échappez au chaos — libérez votre productivité avec une
              plateforme de gestion de projets intuitive et collaborative.
            </p>

            {/* Formulaire email */}
            <form className="lp-hero-form" onSubmit={handleSubmit}>
              <div className="lp-hero-input-wrap">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary lp-hero-btn">
                S'inscrire — c'est gratuit
                <FiArrowRight size={16} />
              </button>
            </form>

            {/* Lien vidéo */}
            <button className="lp-hero-video">
              <span className="lp-hero-video-play">
                <FiPlay size={12} />
              </span>
              Regarder la démo
            </button>
          </div>

          {/* Côté mockup téléphone */}
          <div className="lp-hero-visual lp-anim-up" style={{ animationDelay: '0.15s' }}>
            <div className="lp-phone">
              {/* Barre status */}
              <div className="lp-phone-status">
                <span>9:41</span>
                <div className="lp-phone-status-dots">
                  <span /><span /><span /><span />
                </div>
              </div>

              {/* Header app */}
              <div className="lp-phone-header">
                <span className="lp-phone-header-title">Inbox</span>
                <span className="lp-phone-header-badge">3</span>
              </div>

              {/* Tâches */}
              <div className="lp-phone-tasks">
                <div className="lp-phone-task">
                  <span className="lp-phone-task-dot" style={{ background: 'var(--primary)' }} />
                  <div className="lp-phone-task-content">
                    <span className="lp-phone-task-text">Présentation marketing pour vendredi</span>
                    <span className="lp-phone-task-meta">Échéance : Ven. 14h</span>
                  </div>
                </div>

                <div className="lp-phone-task lp-phone-task-highlight">
                  <span className="lp-phone-task-dot" style={{ background: 'var(--accent)' }} />
                  <div className="lp-phone-task-content">
                    <span className="lp-phone-task-text">Votre séjour à Austin</span>
                    <span className="lp-phone-task-meta">Hôtel — Fairmont Austin</span>
                  </div>
                </div>

                <div className="lp-phone-task">
                  <span className="lp-phone-task-dot" style={{ background: 'var(--warning)' }} />
                  <div className="lp-phone-task-content">
                    <span className="lp-phone-task-text">Analyser les campagnes récentes</span>
                    <span className="lp-phone-task-meta">En attente depuis 2j</span>
                  </div>
                </div>

                <div className="lp-phone-task">
                  <span className="lp-phone-task-dot" style={{ background: 'var(--info)' }} />
                  <div className="lp-phone-task-content">
                    <span className="lp-phone-task-text">Reviewer le sprint backlog</span>
                    <span className="lp-phone-task-meta">Assigné à vous</span>
                  </div>
                </div>
              </div>

              {/* Barre nav basse */}
              <div className="lp-phone-nav">
                <span className="lp-phone-nav-item lp-phone-nav-active">
                  <FiLayout size={18} />
                </span>
                <span className="lp-phone-nav-item">
                  <FiZap size={18} />
                </span>
                <span className="lp-phone-nav-item">
                  <FiUsers size={18} />
                </span>
              </div>
            </div>

            {/* Icônes flottantes */}
            <div className="lp-float lp-float-1">
              <span>📧</span>
              <span className="lp-float-label">E-mail</span>
            </div>
            <div className="lp-float lp-float-2">
              <span>💬</span>
              <span className="lp-float-label">Slack</span>
            </div>
            <div className="lp-float lp-float-3">
              <span>📅</span>
              <span className="lp-float-label">Calendrier</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SOCIAL PROOF ════════ */}
      <section className="lp-stats">
        <div className="lp-stats-container">
          {STATS.map((stat) => (
            <div key={stat.label} className="lp-stat">
              <span className="lp-stat-value">{stat.value}</span>
              <span className="lp-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ APERÇU FEATURES ════════ */}
      <section className="lp-preview">
        <div className="lp-preview-container">
          <div className="lp-preview-header">
            <h2 className="lp-preview-title">
              Pourquoi les équipes choisissent ProjetFlow
            </h2>
            <p className="lp-preview-subtitle">
              Tout ce dont vous avez besoin pour planifier, suivre et livrer vos projets.
            </p>
          </div>

          <div className="lp-preview-grid">
            {PREVIEW_FEATURES.map((feat) => (
              <div key={feat.title} className="lp-preview-card">
                <div className="lp-preview-icon">{feat.icon}</div>
                <h3 className="lp-preview-card-title">{feat.title}</h3>
                <p className="lp-preview-card-desc">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="lp-preview-cta">
            <Link to="/features" className="btn btn-secondary">
              Voir toutes les fonctionnalités
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ CTA BANDEAU ════════ */}
      <section className="lp-cta-band">
        <div className="lp-cta-band-container">
          <h2 className="lp-cta-band-title">
            Prêt à transformer votre gestion de projets ?
          </h2>
          <p className="lp-cta-band-desc">
            Rejoignez des milliers d'équipes qui travaillent plus intelligemment avec ProjetFlow.
          </p>
          <div className="lp-cta-band-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Démarrer gratuitement
              <FiArrowRight size={18} />
            </Link>
            <Link to="/how-it-works" className="btn btn-ghost lp-cta-band-link">
              <FiCheckCircle size={16} />
              Découvrir le guide
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
