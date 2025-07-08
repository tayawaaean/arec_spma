import React, { useState, useEffect } from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSolarPanel, faChargingStation, 
  faBoltLightning, faLeaf, faWater, 
  faGasPump, faTruck, faLightbulb,
  faClock, faUser, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const SolarStats = ({ timeRange = 'month' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Auto-update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Format date exactly as YYYY-MM-DD HH:MM:SS
  const formatDateTime = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  return (
    <div className="dashboard-card h-100">
      <div className="dashboard-card-header d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Solar Pump Performance</h5>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="solar-performance-info">
                Overview of your solar pump system's energy production and efficiency.
              </Tooltip>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-muted" />
          </OverlayTrigger>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-muted me-3">
            <FontAwesomeIcon icon={faUser} className="me-1" /> Dextiee
          </span>
          <span className="text-muted small">
            <FontAwesomeIcon icon={faClock} className="me-1" /> {formatDateTime(currentTime)}
          </span>
        </div>
      </div>
      
      <Row>
        <Col md={3}>
          <div className="total-yield-container text-center p-3 h-100 border-end">
            <h6 className="text-muted mb-1">Total yield</h6>
            <h2 className="display-4 mb-0 fw-bold">156</h2>
            <div className="text-primary mb-0">kWh</div>
            <div className="text-success small mt-2">
              <i className="fas fa-arrow-up"></i> +12% vs previous {timeRange}
            </div>
          </div>
        </Col>
        <Col md={9}>
          <Row className="text-center mb-4">
            <Col>
              <div className="stat-value">16</div>
              <div className="d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faSolarPanel} className="text-primary me-2" />
                <div className="stat-label">Pumps</div>
              </div>
            </Col>
            <Col>
              <div className="stat-value">2.205 <small className="text-muted">kW</small></div>
              <div className="d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faChargingStation} className="text-info me-2" />
                <div className="stat-label">Capacity</div>
              </div>
            </Col>
            <Col>
              <div className="stat-value">68.21 <small className="text-muted">mWh</small></div>
              <div className="d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faBoltLightning} className="text-warning me-2" />
                <div className="stat-label">Generation</div>
              </div>
            </Col>
            <Col>
              <div className="stat-value">16 <small className="text-muted">tons</small></div>
              <div className="d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faLeaf} className="text-success me-2" />
                <div className="stat-label">CO2 Saved</div>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col md={6} className="border-end">
              <div className="text-muted mb-2 d-flex align-items-center">
                <FontAwesomeIcon icon={faWater} className="me-2 text-info" />
                Total Water Pumped (Liters)
              </div>
              <Row>
                <Col>
                  <div className="h4 mb-0">35,450</div>
                  <div className="text-muted small">Today</div>
                </Col>
                <Col>
                  <div className="h4 mb-0">1,256,230</div>
                  <div className="text-muted small">Last 30 days</div>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <div className="text-muted mb-2">
                Savings (PHP)
              </div>
              <Row>
                <Col>
                  <div className="h5 mb-1 d-flex align-items-center">
                    <FontAwesomeIcon icon={faGasPump} className="me-2 text-danger" />
                    <span>₱12,450</span>
                  </div>
                  <div className="h5 mb-1 d-flex align-items-center">
                    <FontAwesomeIcon icon={faTruck} className="me-2 text-warning" />
                    <span>₱9,380</span>
                  </div>
                  <div className="h5 mb-0 d-flex align-items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="me-2 text-success" />
                    <span>₱8,245</span>
                  </div>
                </Col>
                <Col className="text-muted">
                  <div className="small mb-1">vs Gasoline</div>
                  <div className="small mb-1">vs Diesel</div>
                  <div className="small mb-0">vs Electric</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
<Row className="mt-4">
  <Col md={6}>
    <h6 className="text-muted mb-3">Recent Alerts</h6>
    <div className="alerts-container">
      <div className="alert-item d-flex align-items-center py-2 border-bottom">
        <div className="alert-icon alert-warning me-3">
          <FontAwesomeIcon icon={faBoltLightning} />
        </div>
        <div className="alert-content">
          <div className="small fw-bold">Pump #8 Power Fluctuation</div>
          <div className="small text-muted">Today, 01:24:33</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-warning">Warning</span>
        </div>
      </div>
      <div className="alert-item d-flex align-items-center py-2 border-bottom">
        <div className="alert-icon alert-success me-3">
          <FontAwesomeIcon icon={faLeaf} />
        </div>
        <div className="alert-content">
          <div className="small fw-bold">CO2 Reduction Target Reached</div>
          <div className="small text-muted">Yesterday, 18:30:15</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-success">Achievement</span>
        </div>
      </div>
      <div className="alert-item d-flex align-items-center py-2">
        <div className="alert-icon alert-info me-3">
          <FontAwesomeIcon icon={faWater} />
        </div>
        <div className="alert-content">
          <div className="small fw-bold">Water Flow Rate Optimized</div>
          <div className="small text-muted">2025-07-06, 09:15:22</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-info">Info</span>
        </div>
      </div>
    </div>
  </Col>
  <Col md={6}>
    <h6 className="text-muted mb-3">Maintenance Schedule</h6>
    <div className="maintenance-container">
      <div className="maintenance-item d-flex align-items-center py-2 border-bottom">
        <div className="maintenance-icon me-3 text-danger">
          <FontAwesomeIcon icon={faSolarPanel} />
        </div>
        <div className="maintenance-content">
          <div className="small fw-bold">Panel Cleaning - Pumps #3, #7, #12</div>
          <div className="small text-muted">Scheduled: 2025-07-10</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-danger">Urgent</span>
        </div>
      </div>
      <div className="maintenance-item d-flex align-items-center py-2 border-bottom">
        <div className="maintenance-icon me-3 text-primary">
          <FontAwesomeIcon icon={faChargingStation} />
        </div>
        <div className="maintenance-content">
          <div className="small fw-bold">Battery System Check</div>
          <div className="small text-muted">Scheduled: 2025-07-15</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-primary">Routine</span>
        </div>
      </div>
      <div className="maintenance-item d-flex align-items-center py-2">
        <div className="maintenance-icon me-3 text-info">
          <FontAwesomeIcon icon={faWater} />
        </div>
        <div className="maintenance-content">
          <div className="small fw-bold">Water Filter Replacement</div>
          <div className="small text-muted">Scheduled: 2025-07-20</div>
        </div>
        <div className="ms-auto">
          <span className="badge bg-info">Planned</span>
        </div>
      </div>
    </div>
  </Col>
</Row>
      </Row>
    </div>
  );
};

export default SolarStats;