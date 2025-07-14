import { api } from './api';

// Service for pump-related API calls
const pumpService = {
  // Get all pumps with optional filters
  getAllPumps: async (filters = {}, page = 1, limit = 100) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    // Add any filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await api.get(`/pumps?${queryParams.toString()}`);
    return response.data;
  },
  
  // Get a single pump by ID
  getPumpById: async (id) => {
    const response = await api.get(`/pumps/${id}`);
    return response.data;
  },
  
  // Add a new pump (admin/superadmin)
  addPump: async (pumpData) => {
    const response = await api.post('/pumps', pumpData);
    return response.data;
  },
  
  // Update a pump (admin/superadmin)
  updatePump: async (id, pumpData) => {
    const response = await api.put(`/pumps/${id}`, pumpData);
    return response.data;
  },
  
  // Delete a pump (admin/superadmin)
  deletePump: async (id) => {
    const response = await api.delete(`/pumps/${id}`);
    return response.data;
  }
};

export { pumpService };