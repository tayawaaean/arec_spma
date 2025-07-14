import { api } from '../utils/api';

export const userActivityService = {
  // Get most recent activity for all users
  getAllUserActivities: async () => {
    try {
      const response = await api.get('/user-activities');
      return response.data.activities;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  // Get activity for a specific user
  getUserActivity: async (userId) => {
    try {
      const response = await api.get(`/user-activities/${userId}`);
      return response.data.activity;
    } catch (error) {
      console.error(`Error fetching activity for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Helper method to determine status based on timestamp
  getActivityStatus: (timestamp) => {
    if (!timestamp) return 'offline';
    
    const now = new Date();
    const lastActive = new Date(timestamp);
    const minutesDiff = Math.floor((now - lastActive) / (1000 * 60));
    
    if (minutesDiff < 15) return 'active';
    if (minutesDiff < 60) return 'idle';
    return 'offline';
  },
  
  // Format last activity time in a human-readable way
  formatLastActivity: (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const lastActive = new Date(timestamp);
    const minutesDiff = Math.floor((now - lastActive) / (1000 * 60));
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    
    if (minutesDiff < 1) return 'Just now';
    if (minutesDiff < 60) return `${minutesDiff} minute${minutesDiff === 1 ? '' : 's'} ago`;
    if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
    if (daysDiff < 7) return `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
    return lastActive.toLocaleDateString();
  }
}; 