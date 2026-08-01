/* ========================================
   TemplateCard — Carte de template
   ======================================== */

import { FiCheck } from 'react-icons/fi';
import './TemplateCard.css';

export default function TemplateCard({ template, onClick, selected }) {
  return (
    <div
      className={`tpc-card ${selected ? 'tpc-selected' : ''}`}
      onClick={() => onClick?.(template.id)}
    >
      {/* Check si sélectionné */}
      {selected && (
        <div className="tpc-check">
          <FiCheck size={14} />
        </div>
      )}

      {/* Icône */}
      <div className="tpc-icon" style={{ background: template.bgColor || 'var(--primary-light)' }}>
        <span>{template.icon || '📋'}</span>
      </div>

      {/* Texte */}
      <h4 className="tpc-name">{template.name}</h4>
      <p className="tpc-desc">{template.description}</p>

      {/* Colonnes préconfigurées */}
      {template.columns?.length > 0 && (
        <div className="tpc-columns">
          {template.columns.map((col) => (
            <span
              key={col.id || col}
              className="tpc-column-tag"
              style={{ background: col.color || 'var(--bg-dark)', color: 'var(--text-secondary)' }}
            >
              {col.title || col}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}