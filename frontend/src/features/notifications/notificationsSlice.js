/* ========================================
   Slice Notifications — State & reducers
   ======================================== */

import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    /* Remplacer toutes les notifications (fetch initial) */
    setNotifications(state, action) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },

    /* Ajouter une notification (WebSocket) */
    addNotification(state, action) {
      const exists = state.items.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },

    /* Marquer une notification comme lue */
    markAsRead(state, action) {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    /* Tout marquer comme lu */
    markAllRead(state) {
      state.items.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },

    /* Supprimer une notification */
    removeNotification(state, action) {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((n) => n.id !== action.payload);
    },

    /* Chargement */
    setNotificationsLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllRead,
  removeNotification,
  setNotificationsLoading,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
