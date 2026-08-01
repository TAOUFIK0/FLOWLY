/* ========================================
   Slice UI — État interface utilisateur
   ======================================== */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  toast: null,
  /* Contexte du projet courant */
  currentProjectId: null,
  currentProjectName: null,
  currentProjectRole: null, // 'OWNER' | 'MANAGER' | 'MEMBER'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    openModal(state, action) {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal(state) {
      state.activeModal = null;
      state.modalData = null;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
    /* Définir le projet courant et le rôle */
    setCurrentProject(state, action) {
      state.currentProjectId = action.payload.id;
      state.currentProjectName = action.payload.name;
      state.currentProjectRole = action.payload.role;
    },
    clearCurrentProject(state) {
      state.currentProjectId = null;
      state.currentProjectName = null;
      state.currentProjectRole = null;
    },
  },
});

export const {
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showToast,
  clearToast,
  setCurrentProject,
  clearCurrentProject,
} = uiSlice.actions;

export default uiSlice.reducer;