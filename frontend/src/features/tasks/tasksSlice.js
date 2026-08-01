/* ========================================
   Slice Tasks — State des tâches
   ======================================== */

import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTasksLoading(state, action) {
      state.loading = action.payload;
      state.error = null;
    },
    setTasks(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    addTask(state, action) {
      state.items.push(action.payload);
    },
    updateTask(state, action) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    /* CORRECTION : On met à jour le "status" pour matcher le backend */
    moveTask(state, action) {
      const { taskId, newStatus } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
    },
    removeTask(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    addComment(state, action) {
      const { taskId, comment } = action.payload;
      const task = state.items.find((t) => t.id === taskId);
      if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push(comment);
        task.commentCount = (task.commentCount || 0) + 1;
      }
    },
    setTasksError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearTasks(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTasksLoading,
  setTasks,
  addTask,
  updateTask,
  moveTask,
  removeTask,
  addComment,
  setTasksError,
  clearTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
