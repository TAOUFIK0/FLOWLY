/* ========================================
   LoginPage
   ======================================== */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authStart, authSuccess, authFailure, clearError } from './authSlice';
import { authApi } from './api';
import AuthLayout from './components/AuthLayout';
import PasswordInput from './components/PasswordInput';
import './LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const res = await authApi.login(form);
      const data = res.data;

      // On construit l'objet exactement comme l'attend le authSlice
      const payload = {
        token: data.token,
        user: data.user || { // Si le backend a renvoyé un objet "user" imbriqué, on le prend
          id: data.id,
          name: data.name || data.firstName || data.username, // S'il est plat, on prend le nom
          email: data.email,
          role: data.role,
        }
      };

      dispatch(authSuccess(payload));
      navigate('/workspace');
    } catch (err) {
      dispatch(authFailure(err.response?.data?.message || 'Email ou mot de passe incorrect'));
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Gérez vos projets avec simplicité"
      error={error}
      onCloseError={() => dispatch(clearError())}
      footerText="Pas encore de compte ?"
      footerLink="/register"
      footerLinkText="Créer un compte"
    >
      <form onSubmit={handleSubmit} className="lg-form">
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

        <div className="lg-options">
          <label className="lg-checkbox">
            <input type="checkbox" />
            <span>Se souvenir de moi</span>
          </label>
          <a href="#" className="lg-forgot">Mot de passe oublié ?</a>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-full lg-submit">
          {loading ? <span className="spinner" /> : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  );
}

