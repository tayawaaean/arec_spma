import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloud, faWind, faTint, 
  faCompass, faSun, faCloudSun,
  faCloudRain, faSnowflake, faSmog,
  faExclamationTriangle, faCloudShowersHeavy,
  faBolt, faSync, faMapMarkerAlt, faThermometerHalf
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';
import '../../styles/weather-widget.css';

const WeatherWidget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Get icon based on weather condition
  const getWeatherIcon = (condition) => {
    condition = condition?.toLowerCase() || '';
    
    if (condition.includes('clear')) return faSun;
    if (condition.includes('sun')) return faSun;
    if (condition.includes('cloud') && condition.includes('rain')) return faCloudRain;
    if (condition.includes('cloud') && condition.includes('sun')) return faCloudSun;
    if (condition.includes('cloud')) return faCloud;
    if (condition.includes('rain') || condition.includes('drizzle')) return faCloudRain;
    if (condition.includes('thunderstorm')) return faBolt;
    if (condition.includes('snow')) return faSnowflake;
    if (condition.includes('mist') || condition.includes('fog')) return faSmog;
    if (condition.includes('shower')) return faCloudShowersHeavy;
    
    return faCloud; // Default icon
  };
  
  // Get temperature class based on value
  const getTempClass = (temp) => {
    if (temp < 10) return 'temp-cold';
    if (temp < 20) return 'temp-cool';
    if (temp < 30) return 'temp-warm';
    if (temp < 35) return 'temp-hot';
    return 'temp-extreme';
  };
  
  // Get UV Index risk class and text
  const getUVRiskInfo = (uvIndex) => {
    if (uvIndex === undefined || uvIndex === null) {
      return { class: '', text: 'N/A' };
    }
    
    if (uvIndex < 3) return { class: 'uv-low', text: 'Low' };
    if (uvIndex < 6) return { class: 'uv-moderate', text: 'Moderate' };
    if (uvIndex < 8) return { class: 'uv-high', text: 'High' };
    return { class: 'uv-extreme', text: 'Extreme' };
  };
  
  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather
      const currentWeatherResponse = await api.get(`/weather/coords?lat=${lat}&lon=${lon}`);
      setCurrentWeather(currentWeatherResponse.data);
      
      // Fetch forecast
      const forecastResponse = await api.get(`/weather/forecast?lat=${lat}&lon=${lon}`);
      setForecastData(forecastResponse.data.forecast);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
      setLoading(false);
    }
  };
  
  const getCurrentLocation = (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    }
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setGettingLocation(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
        setGettingLocation(false);
        if (forceRefresh) {
          setTimeout(() => setRefreshing(false), 1000);
        }
      },
      err => {
        setGettingLocation(false);
        if (forceRefresh) setRefreshing(false);
        setError(`Error getting location: ${err.message}`);
        console.error('Error getting location:', err);
        
        // Fallback to a default location (e.g., Batac City)
        fetchWeatherData(18.0646901, 120.5573999); 
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  // Format date as "Weekday DD/MM"
  const formatDate = (date) => {
    return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  
  // Load weather data on component mount
  useEffect(() => {
    getCurrentLocation();
    
    // Update date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (loading || gettingLocation) {
    return (
      <div className="dashboard-card weather-card d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{gettingLocation ? 'Getting your location...' : 'Loading weather data...'}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-card weather-card">
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </Alert>
        <button className="btn btn-primary mt-3" onClick={() => getCurrentLocation(true)}>
          Try Again
        </button>
      </div>
    );
  }
  
  if (!currentWeather) {
    return (
      <div className="dashboard-card weather-card">
        <Alert variant="warning">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          No weather data available.
        </Alert>
        <button className="btn btn-primary mt-3" onClick={() => getCurrentLocation(true)}>
          Refresh Weather
        </button>
      </div>
    );
  }
  
  const uvInfo = getUVRiskInfo(currentWeather.uvIndex);
  
  return (
    <div className="dashboard-card weather-card">
      <div className="weather-header">
        <h5 className="mb-0">Weather Today</h5>
        <button 
          className="btn-refresh"
          onClick={() => getCurrentLocation(true)}
          disabled={refreshing}
        >
          <FontAwesomeIcon icon={faSync} spin={refreshing} />
          {refreshing ? ' ' : ' '}
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-muted mb-2">{formatDate(currentDate)}</div>
        
        <div className="d-flex justify-content-center align-items-center mb-3">
          <span className={`temperature-display ${getTempClass(currentWeather.temperature)}`}>
            {currentWeather.temperature}°C
          </span>
          <FontAwesomeIcon 
            icon={getWeatherIcon(currentWeather.condition)} 
            className="weather-icon-large" 
          />
        </div>
        
        <div className="mb-2 fs-5 text-capitalize">{currentWeather.description}</div>
      </div>
      
      <div className="location-info">
        <div className="location-name">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          {currentWeather.location}
        </div>
      </div>
      
      <div className="weather-metrics">
        <div className="metric-card">
          <div className="metric-icon icon-wind">
            <FontAwesomeIcon icon={faWind} />
          </div>
          <div>
            <div className="small text-muted">Wind</div>
            <div className="fw-bold">{currentWeather.wind} km/h</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon icon-humidity">
            <FontAwesomeIcon icon={faTint} />
          </div>
          <div>
            <div className="small text-muted">Humidity</div>
            <div className="fw-bold">{currentWeather.humidity}%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon icon-pressure">
            <FontAwesomeIcon icon={faCompass} />
          </div>
          <div>
            <div className="small text-muted">Pressure</div>
            <div className="fw-bold">{currentWeather.pressure || 1012} hPa</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon icon-uv">
            <FontAwesomeIcon icon={faSun} />
          </div>
          <div>
            <div className="small text-muted">UV Index</div>
            <div className={`fw-bold ${uvInfo.class}`}>
              {currentWeather.uvIndex !== undefined ? `${currentWeather.uvIndex} (${uvInfo.text})` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="forecast-container">
        <div className="forecast-row">
          {forecastData.length > 0 ? (
            forecastData.map((item, index) => (
              <div key={index} className="forecast-day">
                <div className="forecast-day-name">{item.day}</div>
                <FontAwesomeIcon 
                  icon={getWeatherIcon(item.condition)} 
                  className={`forecast-icon ${getTempClass(item.temp)}`}
                />
                <div className={`forecast-temp ${getTempClass(item.temp)}`}>{item.temp}°</div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">
              <p className="text-muted">No forecast data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;