import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faCloud, faCloudRain, faCloudShowersHeavy,
  faBoltLightning
} from '@fortawesome/free-solid-svg-icons';

const MonthlyGeneration = () => {
  return (
    <div className="dashboard-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Monthly Generation</h5>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faBoltLightning} className="text-warning me-2" />
          <span>300kWh</span>
        </div>
      </div>
      
      <Row className="gy-3">
        <Col md={3}>
          <div className="month-card bg-primary"> {/* Active month card */}
            <FontAwesomeIcon icon={faSun} className="month-card-icon" />
            <h6>Sept</h6>
            <div className="mt-2">280 kWh</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="month-card">
            <FontAwesomeIcon icon={faCloud} className="month-card-icon" />
            <h6>Oct</h6>
            <div className="mt-2">352 kWh</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="month-card">
            <FontAwesomeIcon icon={faCloudRain} className="month-card-icon" />
            <h6>Nov</h6>
            <div className="mt-2">158 kWh</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="month-card">
            <FontAwesomeIcon icon={faCloudShowersHeavy} className="month-card-icon" />
            <h6>Dec</h6>
            <div className="mt-2">215 kWh</div>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="stat-bar stat-bar-blue"></span>
            Maximal Used
          </div>
          <div>Oct 265 kWh</div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="stat-bar stat-bar-green"></span>
            Minimal Used
          </div>
          <div>Nov 158 kWh</div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
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