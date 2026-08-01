/* ========================================
   Page Ressources — Guides, webinaires, témoignages
   ======================================== */

import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiMonitor,
  FiVideo,
  FiUsers,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './ResourcesPage.css';

/* ── Ressources "Apprendre" ── */
const LEARN_ITEMS = [
  {
    icon: <FiBookOpen size={22} />,
    title: 'Guide de démarrage',
    desc: 'Maîtrisez ProjetFlow en 8 étapes simples avec notre guide interactif.',
    href: '/how-it-works',
    color: 'var(--primary)',
    bg: 'var(--primary-light)',
  },
  {
    icon: <FiMonitor size={22} />,
    title: 'Guide du travail à distance',
    desc: 'Meilleures pratiques pour gérer des projets distants avec votre équipe.',
    href: '/how-it-works',
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
  {
    icon: <FiVideo size={22} />,
    title: 'Webinaires',
    desc: 'Sessions live avec des experts en gestion de projet et productivité.',
    href: '/resources',
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
  },
  {
    icon: <FiUsers size={22} />,
    title: 'Histoires clients',
    desc: 'Découvrez comment des équipes transforment leur façon de travailler.',
    href: '/resources',
    color: 'var(--success)',
    bg: 'var(--success-light)',
  },
];

/* ── Articles du blog ── */
const BLOG_POSTS = [
  {
    category: 'Productivité',
    title: '5 méthodes Kanban pour doubler la vitesse de livraison',
    excerpt: 'Découvrez les techniques que les équipes agiles utilisent pour optimiser leur flux et réduire les goulots d\'étranglement.',
    date: '12 Juin 2025',
    readTime: '6 min',
    image: 'https://plus.unsplash.com/premium_photo-1725400817468-ddb0135d865d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a2FuYmFuJTIwYm9hcmR8ZW58MHx8MHx8fDA%3D',
  },
  {
    category: 'Collaboration',
    title: 'Comment animer un daily stand-up efficace à distance',
    excerpt: 'Le daily est le pilier de l\'agilité. Voici comment le rendre court, utile et engageant même en visio.',
    date: '8 Juin 2025',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/blog-daily/600/340.jpg',
  },
  {
    category: 'Gestion de projet',
    title: 'Sprint planning : le guide complet pour bien démarrer',
    excerpt: 'Du backlog grooming à l\'estimation des tickets, tout ce qu\'il faut pour planifier des sprints réussis.',
    date: '3 Juin 2025',
    readTime: '8 min',
    image: 'https://media.istockphoto.com/id/1384447558/fr/photo/femme-utilisant-lapplication-de-calendrier-sur-un-ordinateur-de-bureau.webp?a=1&b=1&s=612x612&w=0&k=20&c=nF-3CoDzydKBU04hHcz2AuJHPLj-Amb4PevgQ_UHAE4=',
  },
];

/* ── Témoignages ── */
const TESTIMONIALS = [
  {
    text: 'ProjetFlow a transformé notre façon de collaborer. En 2 semaines, notre équipe avait déjà gagné 30% de temps sur le suivi des tâches.',
    author: 'Sophie Martin',
    role: 'Directrice de produit, TechVision',
    avatar: 'https://plus.unsplash.com/premium_photo-1664910571223-33d32629fa97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D',
  },
  {
    text: 'L\'automatisation nous a permis d\'éliminer les tâches répétitives. Nos développeurs se concentrent enfin sur le code.',
    author: 'Karim Benali',
    role: 'Tech Lead, DataPulse',
    avatar: 'https://plus.unsplash.com/premium_photo-1734603745717-6bd29cb690d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FyaW18ZW58MHx8MHx8fDA%3D',
  },
  {
    text: 'On a testé 5 outils avant de choisir ProjetFlow. Aucun n\'était aussi intuitif pour nos équipes non-techniques.',
    author: 'Léa Dubois',
    role: 'CEO, Studio Créatif',
    avatar: 'https://plus.unsplash.com/premium_photo-1669704098876-2a38eb10e56a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGVhfGVufDB8fDB8fHww',
  },
];

/* ── Chiffres clés ── */
const STATS = [
  { value: '75%', label: 'des organisations voient des résultats dès les 30 premiers jours' },
  { value: '4.8/5', label: 'note moyenne sur plus de 2 000 avis' },
  { value: '50k+', label: 'équipes actives dans le monde' },
];

export default function ResourcesPage() {
  return (
    <div className="rp-page">
      <LandingHeader />

      {/* ════════ EN-TÊTE ════════ */}
      <section className="rp-hero">
        <div className="rp-hero-container">
          <span className="badge badge-primary">Ressources</span>
          <h1 className="rp-hero-title">
            Apprenez, connectez-vous<br />
            <span className="rp-hero-accent">et travaillez mieux ensemble</span>
          </h1>
          <p className="rp-hero-subtitle">
            Guides, webinaires, articles et témoignages pour vous aider
            à tirer le meilleur parti de ProjetFlow.
          </p>
        </div>
      </section>

      {/* ════════ APPRENDRE & CONNECTER ════════ */}
      <section className="rp-learn">
        <div className="rp-learn-container">
          <h2 className="rp-section-title">Apprendre & se connecter</h2>
          <div className="rp-learn-grid">
            {LEARN_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="rp-learn-card"
              >
                <div
                  className="rp-learn-icon"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="rp-learn-text">
                  <h3 className="rp-learn-title">{item.title}</h3>
                  <p className="rp-learn-desc">{item.desc}</p>
                </div>
                <FiArrowRight size={18} className="rp-learn-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CHIFFRES CLÉS ════════ */}
      <section className="rp-stats">
        <div className="rp-stats-container">
          {STATS.map((stat) => (
            <div key={stat.label} className="rp-stat">
              <span className="rp-stat-value">{stat.value}</span>
              <span className="rp-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ BLOG ════════ */}
      <section className="rp-blog">
        <div className="rp-blog-container">
          <div className="rp-blog-header">
            <h2 className="rp-section-title">Derniers articles</h2>
            <Link to="/resources" className="rp-blog-see-all">
              Voir tout le blog
              <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="rp-blog-grid">
            {BLOG_POSTS.map((post) => (
              <article key={post.title} className="rp-blog-card">
                <div className="rp-blog-image-wrapper">
                  <img src={post.image} alt={post.title} className="rp-blog-image" loading="lazy" />
                  <span className="rp-blog-category">{post.category}</span>
                </div>
                <div className="rp-blog-content">
                  <h3 className="rp-blog-title">{post.title}</h3>
                  <p className="rp-blog-excerpt">{post.excerpt}</p>
                  <div className="rp-blog-meta">
                    <span>{post.date}</span>
                    <span className="rp-blog-separator">·</span>
                    <span>{post.readTime} de lecture</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TÉMOIGNAGES ════════ */}
      <section className="rp-testimonials">
        <div className="rp-testimonials-container">
          <h2 className="rp-section-title">Ce que disent nos utilisateurs</h2>
          <div className="rp-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="rp-testimonial-card">
                <div className="rp-testimonial-quote">
                  &ldquo;{t.text}&rdquo;
                </div>
                <div className="rp-testimonial-author">
                  <img src={t.avatar} alt={t.author} className="rp-testimonial-avatar" loading="lazy" />
                  <div>
                    <span className="rp-testimonial-name">{t.author}</span>
                    <span className="rp-testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA BLOG ════════ */}
      <section className="rp-cta">
        <div className="rp-cta-container">
          <h2 className="rp-cta-title">Restez informé</h2>
          <p className="rp-cta-desc">
            Recevez nos derniers articles, guides et astuces directement dans votre boîte mail.
          </p>
          <form className="rp-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="form-input rp-cta-input"
              placeholder="Votre adresse e-mail"
            />
            <button type="submit" className="btn btn-primary rp-cta-btn">
              S'abonner
              <FiArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}


