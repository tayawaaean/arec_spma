import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudRain, faCloud } from '@fortawesome/free-solid-svg-icons';

const WeatherConditions = () => {
  // In a real app, you might fetch this data from an API
  const weatherData = [
    {
      location: 'Manila',
      region: 'Metro Manila',
      temperature: 31,
      condition: 'Sunny',
      icon: faSun,
      iconColor: 'warning',
      humidity: 65,
      wind: 8
    },
    {
      location: 'Cebu',
      region: 'Central Visayas',
      temperature: 29,
      condition: 'Light Rain',
      icon: faCloudRain,
      iconColor: 'info',
      humidity: 78,
      wind: 12
    },
    {
      location: 'Davao',
      region: 'Davao Region',
      temperature: 30,
      condition: 'Cloudy',
      icon: faCloud,
      iconColor: 'secondary',
      humidity: 70,
      wind: 6
    }
  ];

  // Calculate average temperature
  const averageTemp = Math.round(
    weatherData.reduce((sum, location) => sum + location.temperature, 0) / weatherData.length
  );

  return (
    <div>
      <h5 className="mb-3">Weather Conditions</h5>
      <div className="weather-overview mb-3 text-center">
        <div className="text-muted small mb-1">National Average</div>
        <div className="h3 mb-1">{averageTemp}°C</div>
        <div className="text-warning">Mostly Sunny</div>
      </div>
      <hr />
      <div className="weather-summary">
        {weatherData.map((location, index) => (
          <div key={location.location} className={`weather-location-card ${index < weatherData.length - 1 ? 'mb-3' : ''}`}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="h5 mb-0">{location.location}</div>
                <div className="text-muted small">{location.region}</div>
              </div>
              <div className="text-center">
                <FontAwesomeIcon icon={location.icon} className={`text-${location.iconColor}`} size="2x" />
                <div className="h5 mb-0">{location.temperature}°C</div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2 small">
              <span>Humidity: {location.humidity}%</span>
              <span>Wind: {location.wind} km/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherConditions;