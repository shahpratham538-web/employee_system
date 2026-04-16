import API from "./axios";

export const teamsApi = {
  getAll: () => API.get('/teams/'),
  getById: (id) => API.get(`/teams/${id}/`),
  create: (data) => API.post('/teams/', data),
  update: (id, data) => API.put(`/teams/${id}/`, data),
  delete: (id) => API.delete(`/teams/${id}/`),
  addMembers: (teamId, userIds) => API.post(`/teams/${teamId}/members/add/`, { user_ids: userIds }),
  removeMembers: (teamId, userIds) => API.post(`/teams/${teamId}/members/remove/`, { user_ids: userIds }),
  
  // Fetch all users for assigning to teams
  getAllUsers: () => API.get('/users/')
};
