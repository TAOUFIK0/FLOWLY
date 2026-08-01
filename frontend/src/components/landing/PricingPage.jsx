/* ========================================
   Page Tarifs — Plans et prix
   ======================================== */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCheck,
  FiX,
  FiArrowRight,
  FiHelpCircle,
} from 'react-icons/fi';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import './PricingPage.css';

/* ── Données des plans ── */
const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    desc: 'Pour les individus ou petites équipes qui démarrent.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Commencer gratuitement',
    ctaStyle: 'btn-secondary',
    popular: false,
    features: [
      { text: 'Jusqu\'à 3 tableaux', included: true },
      { text: 'Jusqu\'à 5 membres par tableau', included: true },
      { text: 'Cartes illimitées', included: true },
      { text: 'Stockage 10 Mo par carte', included: true },
      { text: 'Automatisation (10 règles)', included: true },
      { text: 'Vues Kanban', included: true },
      { text: 'Intégrations de base', included: true },
      { text: 'Vues Calendrier & Timeline', included: false },
      { text: 'Power-Ups', included: false },
      { text: 'Support prioritaire', included: false },
      { text: 'Export de données', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Pour les équipes en croissance qui ont besoin de plus de puissance.',
    monthlyPrice: 5,
    yearlyPrice: 4,
    cta: 'Essai gratuit 14 jours',
    ctaStyle: 'btn-primary',
    popular: true,
    features: [
      { text: 'Tableaux illimités', included: true },
      { text: 'Jusqu\'à 20 membres par tableau', included: true },
      { text: 'Cartes illimitées', included: true },
      { text: 'Stockage 250 Mo par carte', included: true },
      { text: 'Automatisation illimitée', included: true },
      { text: 'Vues Kanban', included: true },
      { text: 'Vues Calendrier & Timeline', included: true },
      { text: 'Intégrations avancées', included: true },
      { text: '5 Power-Ups par tableau', included: true },
      { text: 'Support email', included: true },
      { text: 'Export CSV', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Pour les organisations aux besoins avancés.',
    monthlyPrice: 10,
    yearlyPrice: 8,
    cta: 'Essai gratuit 14 jours',
    ctaStyle: 'btn-secondary',
    popular: false,
    features: [
      { text: 'Tableaux illimités', included: true },
      { text: 'Membres illimités', included: true },
      { text: 'Cartes illimitées', included: true },
      { text: 'Stockage illimité', included: true },
      { text: 'Automatisation illimitée', included: true },
      { text: 'Toutes les vues', included: true },
      { text: 'Intégrations avancées', included: true },
      { text: 'Power-Ups illimités', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Export CSV & PDF', included: true },
      { text: 'Admin avancé & audit log', included: true },
    ],
  },
];

/* ── FAQ ── */
const FAQ = [
  {
    q: 'Puis-je changer de plan à tout moment ?',
    a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le prorata sera calculé automatiquement.',
  },
  {
    q: 'Que se passe-t-il après la période d\'essai ?',
    a: 'Votre compte bascule automatiquement sur le plan Gratuit. Vos données sont conservées pendant 30 jours.',
  },
  {
    q: 'Y a-t-il des frais cachés ?',
    a: 'Aucun. Le prix affiché est le prix final, taxes incluses pour les pays de l\'UE.',
  },
  {
    q: 'Comment fonctionne la facturation ?',
    a: 'La facturation est mensuelle ou annuelle selon votre choix. Vous pouvez la gérer depuis votre espace admin.',
  },
  {
    q: 'Puis-je annuler mon abonnement ?',
    a: 'Oui, à tout moment et sans frais. Votre accès reste actif jusqu\'à la fin de la période payée.',
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="pp-page">
      <LandingHeader />

      {/* ════════ EN-TÊTE ════════ */}
      <section className="pp-hero">
        <div className="pp-hero-container">
          <span className="badge badge-primary">Tarifs</span>
          <h1 className="pp-hero-title">
            Un plan adapté à chaque équipe
          </h1>
          <p className="pp-hero-subtitle">
            Commencez gratuitement, évoluez quand vous êtes prêt.
            Pas de carte bancaire requise pour démarrer.
          </p>

          {/* Toggle mensuel / annuel */}
          <div className="pp-toggle">
            <span className={`pp-toggle-label ${!yearly ? 'pp-toggle-active' : ''}`}>
              Mensuel
            </span>
            <button
              className={`pp-toggle-switch ${yearly ? 'pp-toggle-on' : ''}`}
              onClick={() => setYearly((y) => !y)}
              aria-label="Basculer entre facturation mensuelle et annuelle"
            >
              <span className="pp-toggle-knob" />
            </button>
            <span className={`pp-toggle-label ${yearly ? 'pp-toggle-active' : ''}`}>
              Annuel
              <span className="pp-toggle-save">-20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ════════ CARTES DE PRIX ════════ */}
      <section className="pp-cards">
        <div className="pp-cards-container">
          <div className="pp-cards-grid">
            {PLANS.map((plan) => {
              const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
              const includedCount = plan.features.filter((f) => f.included).length;

              return (
                <div
                  key={plan.id}
                  className={`pp-card ${plan.popular ? 'pp-card-popular' : ''}`}
                >
                  {/* Badge populaire */}
                  {plan.popular && (
                    <div className="pp-card-badge">Le plus populaire</div>
                  )}

                  {/* Nom et description */}
                  <div className="pp-card-header">
                    <h3 className="pp-card-name">{plan.name}</h3>
                    <p className="pp-card-desc">{plan.desc}</p>
                  </div>

                  {/* Prix */}
                  <div className="pp-card-pricing">
                    {price === 0 ? (
                      <div className="pp-card-free">
                        <span className="pp-card-amount">Gratuit</span>
                      </div>
                    ) : (
                      <div className="pp-card-paid">
                        <span className="pp-card-currency">€</span>
                        <span className="pp-card-amount">{price}</span>
                        <span className="pp-card-period">
                          /membre/mois{yearly ? ', facturé annuellement' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    to="/register"
                    className={`btn ${plan.ctaStyle} pp-card-cta`}
                  >
                    {plan.cta}
                    <FiArrowRight size={16} />
                  </Link>

                  {/* Séparateur */}
                  <div className="pp-card-separator" />

                  {/* Features */}
                  <div className="pp-card-features">
                    <p className="pp-card-features-title">
                      {includedCount} fonctionnalités incluses
                    </p>
                    <ul className="pp-features-list">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.text}
                          className={`pp-feature-item ${!feature.included ? 'pp-feature-excluded' : ''}`}
                        >
                          {feature.included ? (
                            <FiCheck size={16} className="pp-feature-check" />
                          ) : (
                            <FiX size={16} className="pp-feature-cross" />
                          )}
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="pp-faq">
        <div className="pp-faq-container">
          <div className="pp-faq-header">
            <h2 className="pp-faq-title">Questions fréquentes</h2>
            <p className="pp-faq-subtitle">
              Tout ce que vous devez savoir avant de choisir votre plan.
            </p>
          </div>

          <div className="pp-faq-list">
            {FAQ.map((item, index) => (
              <div
                key={index}
                className={`pp-faq-item ${openFaq === index ? 'pp-faq-open' : ''}`}
              >
                <button
                  className="pp-faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.q}</span>
                  <FiHelpCircle size={18} className="pp-faq-icon" />
                </button>
                <div className="pp-faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="pp-bottom">
        <div className="pp-bottom-container">
          <h2>Vous n'êtes toujours pas sûr ?</h2>
          <p>
            Contactez notre équipe pour discuter de vos besoins
            et trouver le plan idéal pour votre organisation.
          </p>
          <div className="pp-bottom-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Démarrer gratuitement
              <FiArrowRight size={18} />
            </Link>
            <a href="mailto:contact@projetflow.com" className="btn btn-secondary btn-lg">
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

