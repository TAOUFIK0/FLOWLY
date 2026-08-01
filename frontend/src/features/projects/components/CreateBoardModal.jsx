/* ========================================
   CreateBoardModal — Modal de création
   ======================================== */

import { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import TemplateCard from './TemplateCard';
import './CreateBoardModal.css';

/* Couleurs disponibles */
const COLORS = [
  '#0D9488', '#06B6D4', '#3B82F6', '#8B5CF6',
  '#F97316', '#EF4444', '#EC4899', '#10B981',
];

export default function CreateBoardModal({ onClose, onCreate, templates }) {
  const [step, setStep] = useState('template'); // 'template' | 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: COLORS[0],
  });
  const [error, setError] = useState('');

  /* Si on sélectionne un template, pré-remplir */
  useEffect(() => {
    if (selectedTemplate) {
      setForm((f) => ({
        ...f,
        name: selectedTemplate.name || '',
        color: selectedTemplate.defaultColor || COLORS[0],
      }));
    }
  }, [selectedTemplate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Le nom du projet est requis');
      return;
    }
    onCreate({
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      templateId: selectedTemplate?.id || null,
    });
  };

  return (
    <div className="cbm-overlay" onClick={onClose}>
      <div className="cbm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="cbm-header">
          <h2 className="cbm-title">Créer un projet</h2>
          <button className="cbm-close" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="cbm-tabs">
          <button
            className={`cbm-tab ${step === 'template' ? 'cbm-tab-active' : ''}`}
            onClick={() => setStep('template')}
          >
            À partir d'un modèle
          </button>
          <button
            className={`cbm-tab ${step === 'custom' ? 'cbm-tab-active' : ''}`}
            onClick={() => { setStep('custom'); setSelectedTemplate(null); }}
          >
            Projet vide
          </button>
        </div>

        {/* Corps */}
        <div className="cbm-body">
          {/* ── Étape 1 : Templates ── */}
          {step === 'template' && (
            <div className="cbm-templates">
              {templates?.length > 0 ? (
                <div className="cbm-templates-grid">
                  {templates.map((tpl) => (
                    <TemplateCard
                      key={tpl.id}
                      template={tpl}
                      selected={selectedTemplate?.id === tpl.id}
                      onClick={setSelectedTemplate}
                    />
                  ))}
                </div>
              ) : (
                <div className="cbm-no-templates">
                  <p>Aucun modèle disponible</p>
                  <button className="btn btn-ghost" onClick={() => setStep('custom')}>
                    Créer un projet vide
                  </button>
                </div>
              )}

              {selectedTemplate && (
                <button className="btn btn-primary cbm-next" onClick={() => setStep('custom')}>
                  Continuer avec ce modèle
                  <FiPlus size={16} />
                </button>
              )}
            </div>
          )}

          {/* ── Étape 2 : Formulaire ── */}
          {step === 'custom' && (
            <form className="cbm-form" onSubmit={handleSubmit}>
              {error && (
                <div className="cbm-error">{error}</div>
              )}

              <div className="form-group">
                <label className="form-label">Nom du projet</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex : Refonte site web"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(''); }}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (optionnel)</label>
                <textarea
                  className="form-input cbm-textarea"
                  placeholder="Décrivez brièvement votre projet…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Couleur</label>
                <div className="cbm-colors">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`cbm-color ${form.color === color ? 'cbm-color-active' : ''}`}
                      style={{ background: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <div className="cbm-selected-tpl">
                  <span>Modèle :</span>
                  <strong>{selectedTemplate.name}</strong>
                </div>
              )}

              <div className="cbm-form-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer le projet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}