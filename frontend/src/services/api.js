import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/api/v1/projects'),
  getById: (id) => api.get(`/api/v1/projects/${id}`),
  create: (data) => api.post('/api/v1/projects', data),
  update: (id, data) => api.put(`/api/v1/projects/${id}`, data),
  delete: (id) => api.delete(`/api/v1/projects/${id}`),
};

// CSV Upload/Download API
export const csvAPI = {
  uploadFile: (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    return api.post('/api/v1/csv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadFile: (fileId) => api.get(`/api/v1/csv/download/${fileId}`, {
    responseType: 'blob',
  }),
  listFiles: (projectId) => api.get(`/api/v1/csv/files/${projectId}`),
};

// Audit API
export const auditAPI = {
  getLog: (projectId) => api.get(`/api/v1/audit/${projectId}`),
};

export default api;
