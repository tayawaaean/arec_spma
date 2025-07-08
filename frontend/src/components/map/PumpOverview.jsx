import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faBolt, faSolarPanel } from '@fortawesome/free-solid-svg-icons';

const PumpOverview = ({ totalPower, pumpsByStatus, totalPumps, totalPanels }) => {
  return (
    <div>
      <h5 className="mb-3">Solar Pump Overview</h5>
      <div className="installation-info">
        <div className="mb-3">
          <div className="text-muted small">Total Power</div>
          <div className="h4 mb-0">{totalPower}</div>
        </div>
        <hr className="my-3" />
        <div className="mb-3">
          <div className="text-muted small mb-2">Pump Status</div>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div className="status-indicator bg-success me-2"></div>
              <span>Active</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="h5 mb-0">{pumpsByStatus.active || 0}</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div className="status-indicator bg-warning me-2"></div>
              <span>Maintenance</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="h5 mb-0">{pumpsByStatus.maintenance || 0}</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div className="status-indicator bg-danger me-2"></div>
              <span>Offline</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="h5 mb-0">{pumpsByStatus.offline || 0}</span>
            </div>
          </div>
          <div className="progress mt-2" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-success"
              style={{
                width: `${((pumpsByStatus.active || 0) / totalPumps) * 100}%`
              }}
              title="Active"
            ></div>
            <div
              className="progress-bar bg-warning"
              style={{
                width: `${((pumpsByStatus.maintenance || 0) / totalPumps) * 100}%`
              }}
              title="Maintenance"
            ></div>
            <div
              className="progress-bar bg-danger"
              style={{
                width: `${((pumpsByStatus.offline || 0) / totalPumps) * 100}%`
              }}
              title="Offline"
            ></div>
          </div>
        </div>
      </div>
      
      {/* Flow metrics */}
      <div className="mt-4">
        <h6 className="text-muted mb-2">Performance Metrics</h6>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTint} className="text-info me-2" />
            <span>Max Flow Rate</span>
          </div>
          <span>50m³/h</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faBolt} className="text-warning me-2" />
            <span>Total Panel Power</span>
          </div>
          <span>9.0kW</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faSolarPanel} className="text-primary me-2" />
            <span>Solar Panels</span>
          </div>
          <span>{totalPanels} panels</span>
        </div>
      </div>
    </div>
  );
};

export default PumpOverview;