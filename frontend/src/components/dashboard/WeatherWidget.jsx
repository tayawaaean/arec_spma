import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloud, faWind, faTint, 
  faCompass, faSun, faCloudSun,
  faCloudRain
} from '@fortawesome/free-solid-svg-icons';

const WeatherWidget = () => {
  const [forecastData] = useState([
    { day: 'Today', temp: 27, icon: faCloud, condition: 'Cloudy' },
    { day: 'Tomorrow', temp: 29, icon: faCloudSun, condition: 'Partly Cloudy' },
    { day: 'Mon', temp: 30, icon: faSun, condition: 'Sunny' },
    { day: 'Tue', temp: 28, icon: faCloudRain, condition: 'Rainy' }
  ]);
  
  return (
    <div className="dashboard-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Weather today</h5>
        <a href="#" className="text-decoration-none">See More</a>
      </div>
      
      <div className="weather-widget mt-3">
        <div className="mb-2 text-muted">Fri 20/5</div>
        
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="temperature display-4 fw-bold">27°C</div>
          <FontAwesomeIcon icon={faCloud} className="weather-icon" size="3x" />
        </div>
        
        <div className="mb-3">Extremely Cloudy</div>
        
        <div className="weather-details">
          <div className="row gy-2">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faWind} className="me-2 text-muted" />
                <div>
                  <small className="text-muted d-block">Wind</small>
                  <span>8 km/h</span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTint} className="me-2 text-info" />
                <div>
                  <small className="text-muted d-block">Humidity</small>
                  <span>65%</span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCompass} className="me-2 text-muted" />
                <div>
                  <small className="text-muted d-block">Pressure</small>
                  <span>1012 hPa</span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faSun} className="me-2 text-warning" />
                <div>
                  <small className="text-muted d-block">UV Index</small>
                  <span>Medium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-3" />
        
        <div className="forecast-row">
          {forecastData.map((item, index) => (
            <div key={index} className="forecast-day">
              <div className="small text-muted">{item.day}</div>
              <FontAwesomeIcon icon={item.icon} className="my-2" />
              <div>{item.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;