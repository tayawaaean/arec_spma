import axios from 'axios';

const API_BASE_URL = '/api'; // Your backend API base URL
const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const weatherService = {
  // Get weather data for the user's current location using your backend API
  getCurrentWeatherByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/coords?lat=${lat}&lon=${lon}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },
  
  // Get forecast directly from OpenWeatherMap API
  getForecastByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },
  
  // Get location name from coordinates using OpenWeatherMap Geocoding API
  getLocationName: async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`);
      if (response.data && response.data.length > 0) {
        return response.data[0].name;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown Location';
    }
  }
};