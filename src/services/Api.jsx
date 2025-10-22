// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const cleanToken = token?.replace(/^Bearer\s+/i, '').trim();

    const config = {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add body if it exists (for POST, PUT requests)
    if (options.body) {
      config.body = options.body;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // For DELETE requests that might not return content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Habit endpoints
  async getHabits() {
    return this.request('/habits');
  }

  async createHabit(habitData) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  async updateHabit(habitId, habitData) {
    return this.request(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  }

  async updateHabitTarget(habitId, targetStreak) {
    return this.request(`/habits/${habitId}/target`, {
      method: 'PUT',
      body: JSON.stringify({ targetStreak }),
    });
  }

  async deleteHabit(habitId) {
    return this.request(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  }

  // Habit Log endpoints
  async markHabit(habitId, status) {
    return this.request('/habitlogs', {
      method: 'POST',
      body: JSON.stringify({
        habitId,
        status: status.toUpperCase()
      }),
    });
  }

  // Certificate endpoints
  async getCertificates() {
    return this.request('/certificates');
  }

  async getCertificatesByHabit(habitId) {
    return this.request(`/certificates/habit/${habitId}`);
  }

  async generateCertificates() {
    return this.request('/certificates/generate-all', {
      method: 'POST',
    });
  }

  // Level Up endpoints
  async processLevelUp(habitId, acceptChallenge) {
    return this.request(`/habits/${habitId}/level-up`, {
      method: 'POST',
      body: JSON.stringify({
        habitId,
        acceptChallenge
      }),
    });
  }

  async checkLevelUpOffered(habitId) {
    return this.request(`/habits/${habitId}/level-up-offered`);
  }

  // Progress endpoints
  async getHabitProgress(habitId) {
    return this.request(`/habits/${habitId}/progress`);
  }

  async getHabitsByStreak(streakLength) {
    return this.request(`/habits/streak/${streakLength}`);
  }
}

export default new ApiService();