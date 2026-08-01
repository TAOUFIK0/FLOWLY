/* ========================================
   API Tasks — Appels centralisés
   ======================================== */

import axiosInstance from '../../api/axiosInstance';

export const tasksApi = {
  /* Récupérer les tâches d'un board (Route existante dans votre controller) */
  getByBoard: (boardId) => axiosInstance.get(`/boards/${boardId}/tasks`),

  /* Créer une tâche (Doit matcher POST /api/tasks et TaskRequest.java) */
  create: (data) => axiosInstance.post(`/tasks`, data),

  /* Mettre à jour une tâche (Matcher PATCH /api/tasks/{taskId}) */
  update: (taskId, data) => axiosInstance.patch(`/tasks/${taskId}`, data),

  /* Supprimer une tâche */
  delete: (taskId) => axiosInstance.delete(`/tasks/${taskId}`),

  /* Ajouter un commentaire */
  addComment: (taskId, text) => axiosInstance.post(`/tasks/${taskId}/comments`, { text }),
};