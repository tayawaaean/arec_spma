import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloud, faSun, faWind, faTint, 
  faMapMarkerAlt, faCloudRain, faSyncAlt, 
  faLocationArrow, faClock, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';

const WeatherConditions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userWeather, setUserWeather] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('2025-07-09 03:28:46');
  const [locationName, setLocationName] = useState('');

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(location);
          
          // Get weather for user's location
          const response = await api.get(`/weather/coords?lat=${location.lat}&lon=${location.lon}`);
          if (response.data) {
            setUserWeather(response.data);
            
            // If the API returns a location name, use it
            if (response.data.location) {
              setLocationName(response.data.location);
            } else {
              // Fallback to reverse geocoding if needed
              try {
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`);
                const geoData = await geoResponse.json();
                const placeName = geoData.address.city || 
                                 geoData.address.town || 
                                 geoData.address.village || 
                                 geoData.address.municipality ||
                                 'Unknown Location';
                setLocationName(placeName);
              } catch (geoErr) {
                console.error('Error getting location name:', geoErr);
                setLocationName('Your Location');
              }
            }
            
            // Update the timestamp
            setLastUpdated('2025-07-09 03:28:46');
          }
        } catch (err) {
          console.error('Error fetching weather:', err);
          setLocationError(`Failed to load weather data`);
        } finally {
          setLoading(false);
          setGettingLocation(false);
        }
      },
      (error) => {
        setLoading(false);
        setGettingLocation(false);
        setLocationError('Location access denied');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return { icon: faSun, className: 'text-warning' };
      case 'rain':
        return { icon: faCloudRain, className: 'text-info' };
      case 'clouds':
        return { icon: faCloud, className: 'text-secondary' };
      default:
        return { icon: faCloud, className: 'text-muted' };
    }
  };

  if (loading && !userWeather) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="mt-2 small">Loading weather data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">
          <FontAwesomeIcon icon={faCloud} className="me-2 text-primary" />
          Weather Conditions
        </h6>
        <Button 
          variant="link" 
          size="sm" 
          onClick={getUserLocation} 
          title="Refresh weather data"
          disabled={gettingLocation}
          className="p-0"
        >
          <FontAwesomeIcon icon={gettingLocation ? faSpinner : faSyncAlt} spin={gettingLocation} className="text-secondary" />
        </Button>
      </div>
      
      {/* Weather Card */}
      <div className="weather-card">
        {locationError && (
          <Alert variant="warning" className="py-2 px-3 small mb-0">
            {locationError}
            <Button size="sm" variant="link" className="p-0 d-block" onClick={getUserLocation}>
              <small>Try Again</small>
            </Button>
          </Alert>
        )}

        {gettingLocation && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
            <p className="small mt-2 mb-0">Getting location...</p>
          </div>
        )}

        {!locationError && !gettingLocation && userWeather && (
          <>
            {/* Location header */}
            <div className="location-header">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                <span className="location-name">{locationName || 'Your Location'}</span>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={getUserLocation}
                className="p-0 refresh-button"
              >
                <FontAwesomeIcon icon={faLocationArrow} className="text-primary" />
              </Button>
            </div>
            
            {/* Temperature */}
            <div className="temperature-display">
              {userWeather.temperature}°C
            </div>
            
            {/* Weather condition */}
            <div className="condition-display">
              <div className="condition-icon">
                <FontAwesomeIcon 
                  icon={getWeatherIcon(userWeather.condition).icon} 
                  className={getWeatherIcon(userWeather.condition).className} 
                />
              </div>
              <div className="condition-text">{userWeather.condition}</div>
              <div className="condition-description">{userWeather.description}</div>
            </div>
            
            {/* Metrics */}
            <div className="metrics">
              <div className="metric-item">
                <FontAwesomeIcon icon={faTint} className="text-info me-2" />
                <span>{userWeather.humidity}% Humidity</span>
              </div>
              <div className="metric-item">
                <FontAwesomeIcon icon={faWind} className="text-primary me-2" />
                <span>{userWeather.wind} km/h</span>
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="timestamp">
              <FontAwesomeIcon icon={faClock} className="me-2" />
              {lastUpdated}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .weather-card {
          background-color: #1e2a3b;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .location-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background-color: #182433;
          color: white;
        }
        
        .location-icon {
          color: #ff5252;
          margin-right: 8px;
        }
        
        .location-name {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .refresh-button {
          color: #007bff;
        }
        
        .temperature-display {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 400;
          color: #007bff;
          padding: 10px 0;
        }
        
        .condition-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 10px;
        }
        
        .condition-icon {
          font-size: 2.5rem;
          margin-bottom: 5px;
        }
        
        .condition-text {
          font-weight: 600;
          color: white;
          font-size: 1rem;
        }
        
        .condition-description {
          color: #adb5bd;
          font-size: 0.85rem;
        }
        
        .metrics {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 12px;
          color: white;
          font-size: 0.9rem;
        }
        
        .timestamp {
          text-align: center;
          color: #6c757d;
          font-size: 0.75rem;
          padding: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

export default WeatherConditions;