/* ========================================
   PasswordInput — Input avec toggle visibilité
   ======================================== */

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './PasswordInput.css';

export default function PasswordInput({ value, onChange, placeholder, required }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="pi-wrap">
      <input
        type={visible ? 'text' : 'password'}
        name="password"
        className="form-input pi-input"
        placeholder={placeholder || 'Votre mot de passe'}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="pi-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
}