/* ========================================
   Slice Auth — State d'authentification
   ======================================== */

import { createSlice } from '@reduxjs/toolkit';

/* Initialisation safe depuis le localStorage */
let token = localStorage.getItem('token');
let user = null;
try {
  const userStr = localStorage.getItem('user');
  if (userStr) user = JSON.parse(userStr);
} catch (e) {
  /* JSON corrompu → on le supprime */
  localStorage.removeItem('user');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token,
    user,
    loading: false,
    error: null,
  },
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      /* Ne sauvegarder que si la valeur existe */
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;