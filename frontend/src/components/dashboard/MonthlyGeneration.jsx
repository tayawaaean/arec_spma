import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faCloud, faCloudRain, faCloudShowersHeavy,
  faBoltLightning
} from '@fortawesome/free-solid-svg-icons';

const MonthlyGeneration = () => {
  return (
    <div className="dashboard-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Monthly Generation</h5>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faBoltLightning} className="text-warning me-2" />
          <span>300kWh</span>
        </div>
      </div>
      
      {/* More space efficient month layout */}
      <div className="d-flex justify-content-between mb-3">
        <div className="month-card bg-primary flex-fill mx-1 text-center">
          <FontAwesomeIcon icon={faSun} className="month-card-icon" />
          <h6 className="mb-1">Sept</h6>
          <div>280 kWh</div>
        </div>
        <div className="month-card flex-fill mx-1 text-center">
          <FontAwesomeIcon icon={faCloud} className="month-card-icon" />
          <h6 className="mb-1">Oct</h6>
          <div>352 kWh</div>
        </div>
        <div className="month-card flex-fill mx-1 text-center">
          <FontAwesomeIcon icon={faCloudRain} className="month-card-icon" />
          <h6 className="mb-1">Nov</h6>
          <div>158 kWh</div>
        </div>
        <div className="month-card flex-fill mx-1 text-center">
          <FontAwesomeIcon icon={faCloudShowersHeavy} className="month-card-icon" />
          <h6 className="mb-1">Dec</h6>
          <div>215 kWh</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="stat-bar stat-bar-blue"></span>
            Maximal Used
          </div>
          <div>Oct 265 kWh</div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="stat-bar stat-bar-green"></span>
            Minimal Used
          </div>
          <div>Nov 158 kWh</div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="stat-bar stat-bar-yellow"></span>
            Total Used
          </div>
          <div>425 kWh</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyGeneration;