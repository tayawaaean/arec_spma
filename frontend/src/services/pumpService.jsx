import axios from 'axios';
import { api } from '../utils/api';

export const pumpService = {
  // Get all pumps with pagination and filtering
  getAllPumps: async (page = 1, limit = 20, filters = {}) => {
    try {
      let queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Add any filters to the query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // Log the final query for debugging
      console.log('Fetching pumps with query:', queryParams.toString());
      
      const response = await api.get(`/pumps?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pumps:', error);
      throw error;
    }
  },
  
  // Export pumps to CSV (get all matching records without pagination)
  exportPumpsToCSV: async (filters = {}) => {
    try {
      let queryParams = new URLSearchParams();
      
      // Set a large limit to get all records
      queryParams.append('page', 1);
      queryParams.append('limit', 10000); // Very large limit to get all records
      queryParams.append('export', 'true'); // Flag for export
      
      // Add any filters to the query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      console.log('Exporting pumps with query:', queryParams.toString());
      
      const response = await api.get(`/pumps?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting pumps:', error);
      throw error;
    }
  },
  
  // Other methods remain the same...
  getPump: async (id) => {
    try {
      const response = await api.get(`/pumps/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pump ${id}:`, error);
      throw error;
    }
  },
  
  addPump: async (pumpData) => {
    try {
      const response = await api.post('/pumps', pumpData);
      return response.data;
    } catch (error) {
      console.error('Error adding pump:', error);
      throw error;
    }
  },
  
  updatePump: async (id, pumpData) => {
    try {
      const response = await api.put(`/pumps/${id}`, pumpData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pump ${id}:`, error);
      throw error;
    }
  },
  
  deletePump: async (id) => {
    try {
      const response = await api.delete(`/pumps/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pump ${id}:`, error);
      throw error;
    }
  },
  
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const address = response.data.address;
      
      return {
        barangay: address.suburb || address.neighbourhood || '',
        municipality: address.city || address.town || address.village || '',
        region: address.state || '',
        country: address.country || 'Philippines'
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }
};