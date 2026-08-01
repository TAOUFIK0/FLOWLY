/* ========================================
   API Projects — Appels centralisés
   ======================================== */

import axiosInstance from '../../api/axiosInstance';

export const projectsApi = {
  getAll: () => axiosInstance.get('/projects'),
  getById: (id) => axiosInstance.get(`/projects/${id}`),
  create: (data) => axiosInstance.post('/projects', data),
  update: (id, data) => axiosInstance.put(`/projects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/projects/${id}`),
  getTemplates: () => axiosInstance.get('/projects/templates'),
  inviteMember: (projectId, data) => axiosInstance.post(`/projects/${projectId}/invitations`, data),
  getMembers: (projectId) => axiosInstance.get(`/projects/${projectId}/members`),
   respondToInvitation: (invitationId, data) => axiosInstance.post(`/projects/invitations/${invitationId}/respond`, data),
    updateMemberRole: (projectId, userId, role) => axiosInstance.patch(`/projects/${projectId}/members/${userId}/role`, { role }),
};