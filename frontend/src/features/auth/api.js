/* ========================================
   API Auth — Appels centralisés
   ======================================== */

import axiosInstance from '../../api/axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  // forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
};
