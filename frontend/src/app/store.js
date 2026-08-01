/* ========================================
   Store Redux — Configuration centrale
   ======================================== */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },

  /* Désactiver la vérification de sérialisation :
     Redux lève des warnings pour les dates, Error, FormData…
     qui transitent par les slices (ex: erreur API stockée dans le state) */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  /* DevTools activés uniquement en développement */
  devTools: import.meta.env.DEV,
});