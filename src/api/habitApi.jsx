import apiClient from './apiClient';

export const habitAPI = {
  getAllHabits: () => apiClient.get('/habits'),
  getHabitById: (id) => apiClient.get(`/habits/${id}`),
  createHabit: (habitData) => apiClient.post('/habits', habitData),
  updateHabit: (id, habitData) => apiClient.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => apiClient.delete(`/habits/${id}`),
  getHabitProgress: (id) => apiClient.get(`/habits/${id}/progress`),
  // FIXED: Use the correct endpoint that exists in your backend
  markHabitComplete: (data) => apiClient.post('/habitlogs', data),
  getChallengeHistory: (id) => apiClient.get(`/habits/${id}/challenge-history`),
  setChallenge: (data) => apiClient.post('/habits/set-challenge', data),


   // New methods for SummaryCards
  getHabitsCount: () => apiClient.get('/habits/count'),
  getTodayCompletedCount: () => apiClient.get('/habitlogs/done/count'),
  getOverallPerformance: () => apiClient.get('/habits/overall-performance'),
};