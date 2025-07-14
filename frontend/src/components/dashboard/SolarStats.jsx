import React from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSolarPanel, faChargingStation, 
  faBoltLightning, faLeaf, faWater, 
  faGasPump, faTruck, faLightbulb,
  faInfoCircle, faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/solar-stats.css';

const SolarStats = ({ timeRange = 'month' }) => {
  // Performance data
  const performanceData = {
    yield: {
      value: '156',
      unit: 'kWh',
      change: '+12%',
      changeType: 'positive'
    },
    pumps: {
      value: '16',
      unit: '',
      icon: faSolarPanel,
      color: '#3b82f6'
    },
    capacity: {
      value: '2.205',
      unit: 'kW',
      icon: faChargingStation,
      color: '#38bdf8'
    },
    generation: {
      value: '68.21',
      unit: 'mWh',
      icon: faBoltLightning,
      color: '#eab308'
    },
    co2saved: {
      value: '16',
      unit: 'tons',
      icon: faLeaf,
      color: '#10b981'
    }
  };

  // Water usage data
  const waterData = {
    today: {
      value: '35,450',
      label: 'Today'
    },
    month: {
      value: '1,256,230',
      label: 'Last 30 days'
    }
  };

  // Savings data
  const savingsData = [
    {
      type: 'gasoline',
      icon: faGasPump,
      value: '₱12,450',
      label: 'vs Gasoline',
      color: '#ef4444'
    },
    {
      type: 'diesel',
      icon: faTruck,
      value: '₱9,380',
      label: 'vs Diesel',
      color: '#f59e0b'
    },
    {
      type: 'electric',
      icon: faLightbulb,
      value: '₱8,245',
      label: 'vs Electric',
      color: '#10b981'
    }
  ];
  
  return (
    <div className="dashboard-card solar-stats-card h-100">
      <div className="solar-stats-header">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Solar Pump Performance</h5>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="solar-performance-info" className="custom-tooltip">
                Overview of your solar pump system's energy production and efficiency.
              </Tooltip>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} className="ms-2 info-icon" />
          </OverlayTrigger>
        </div>
      </div>
      
      <div className="solar-stats-content">
        {/* Yield and Stats Section */}
        <div className="yield-section">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(210px, 1fr) 3fr", gap: "0.6rem" }}>
            <div>
              <div className="yield-card">
                <div className="yield-label">TOTAL YIELD</div>
                <div className="yield-value">{performanceData.yield.value}</div>
                <div className="yield-unit">kWh</div>
                <div className="yield-comparison">
                  <FontAwesomeIcon icon={faArrowUp} />
                  <span>{performanceData.yield.change} vs previous {timeRange}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="stats-grid">
                {Object.entries(performanceData)
                  .filter(([key]) => key !== 'yield')
                  .map(([key, stat]) => (
                    <div key={key} className="stats-item">
                      <div className="stats-content">
                        <div className="stats-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                        <div className="stats-value">
                          {stat.value}
                          {stat.unit && <small>{stat.unit}</small>}
                        </div>
                        <div className="stats-icon-container">
                          <div className="stats-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            <FontAwesomeIcon icon={stat.icon} />
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Water and Savings Metrics Section */}
        <div className="metrics-row">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <div className="metrics-card water-metrics">
                <div className="card-header">
                  <div className="header-title">
                    <FontAwesomeIcon icon={faWater} className="header-icon" />
                    <span>Total Water Pumped (Liters)</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="metrics-values">
                    <div className="metric-block">
                      <div className="metric-value">{waterData.today.value}</div>
                      <div className="metric-label">{waterData.today.label}</div>
                    </div>
                    <div className="metric-block">
                      <div className="metric-value">{waterData.month.value}</div>
                      <div className="metric-label">{waterData.month.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="metrics-card savings-metrics">
                <div className="card-header">
                  <div className="header-title">
                    <span>Savings (PHP)</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="savings-content">
                    {savingsData.map((saving, index) => (
                      <div key={index} className="saving-row">
                        <div 
                          className="saving-icon" 
                          style={{ backgroundColor: `${saving.color}20`, color: saving.color }}
                        >
                          <FontAwesomeIcon icon={saving.icon} />
                        </div>
                        <div className="saving-value">{saving.value}</div>
                        <div className="saving-label">{saving.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarStats;