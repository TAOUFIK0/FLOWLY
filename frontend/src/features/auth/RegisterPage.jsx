/* ========================================
   RegisterPage
   ======================================== */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authStart, authSuccess, authFailure, clearError } from './authSlice';
import { authApi } from './api';
import AuthLayout from './components/AuthLayout';
import PasswordInput from './components/PasswordInput';
import './RegisterPage.css';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const res = await authApi.register(form);
      dispatch(authSuccess(res.data));
      navigate('/workspace');
    } catch (err) {
      dispatch(authFailure(err.response?.data?.message || "Erreur lors de l'inscription"));
    }
  };

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez ProjetFlow gratuitement"
      error={error}
      onCloseError={() => dispatch(clearError())}
      footerText="Déjà un compte ?"
      footerLink="/login"
      footerLinkText="Se connecter"
    >
      <form onSubmit={handleSubmit} className="rg-form">
        <div className="form-group">
          <label className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            className="form-input"
            placeholder="votre-nom"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="nom@entreprise.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <PasswordInput
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-full rg-submit">
          {loading ? <span className="spinner" /> : 'Créer mon compte'}
        </button>
      </form>
    </AuthLayout>
  );
}





