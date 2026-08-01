/* ========================================
   Slice Projects — State des projets
   ======================================== */

import { createSlice } from '@reduxjs/toolkit';

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    templates: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProjectsLoading(state, action) {
      state.loading = action.payload;
      state.error = null;
    },
    setProjects(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    setTemplates(state, action) {
      state.templates = action.payload;
    },
    addProject(state, action) {
      state.items.unshift(action.payload);
    },
    updateProject(state, action) {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeProject(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setProjectsError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProjects(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProjectsLoading,
  setProjects,
  setTemplates,
  addProject,
  updateProject,
  removeProject,
  setProjectsError,
  clearProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;

