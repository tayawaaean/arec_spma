const axios = require('axios');

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

async function getCurrentWeatherByCoords(lat, lon) {
  if (!API_KEY) throw new Error('OpenWeatherMap API key is not set');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const { data } = await axios.get(url);
  return {
    temperature: data.main.temp,
    weather: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    wind_speed: data.wind.speed,
    icon: data.weather[0].icon,
    raw: data, // Optionally return full data for frontend
  };
}

module.exports = { getCurrentWeatherByCoords };