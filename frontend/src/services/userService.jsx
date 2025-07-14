import { api } from '../utils/api';

export const userService = {
  // Get all users with pagination and filtering
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get(`/users?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update an existing user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Change user password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/users/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Get user types - this might be hardcoded or come from an API endpoint
  getUserTypes: () => {
    // You could fetch this from an API or use a hardcoded list
    return ['user', 'admin', 'superadmin'];
  }
};