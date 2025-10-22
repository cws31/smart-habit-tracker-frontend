import apiClient from './apiClient';

export const certificateAPI = {
  getAllCertificates: () => apiClient.get('/certificates'),
  getCertificateById: (id) => apiClient.get(`/certificates/${id}`),
  generateCertificate: (habitId) => apiClient.post(`/certificates/generate/${habitId}`),
  downloadCertificate: (id) => apiClient.get(`/certificates/${id}/download`, { responseType: 'blob' }),
};