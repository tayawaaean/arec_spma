import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, faChartLine, faChartBar, faChartArea, faSync,
  faDownload, faCog, faWater, faInfoCircle, faArrowUp, 
  faArrowDown, faBolt, faTint, faChargingStation, faFileExport,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DataChart from '../components/data/DataChart';
import PumpSelector from '../components/data/PumpSelector';
import MetricSelector from '../components/data/MetricSelector';
import { generatePumpData } from '../utils/pumpDataSimulator';

const DataPage = () => {
  // State management
  const [selectedPumps, setSelectedPumps] = useState([1]);
  const [selectedMetrics, setSelectedMetrics] = useState(['voltage']);
  const [interval, setInterval] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [pumpData, setPumpData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  // Current user and time
  const currentUser = 'Dextieefull';
  const currentDateTime = '2025-07-08 07:21:44';

  // Metric options
  const metrics = [
    { value: 'voltage', label: 'Voltage (V)', color: '#3b82f6' },
    { value: 'current', label: 'Current (A)', color: '#ef4444' },
    { value: 'power', label: 'Power (W)', color: '#f59e0b' },
    { value: 'flow', label: 'Water Flow (L/min)', color: '#22d3ee' },
    { value: 'energy', label: 'Energy (Wh)', color: '#10b981' },
    { value: 'water_volume', label: 'Water Volume (L)', color: '#8b5cf6' }
  ];

  // Pump options (simulated)
  const pumps = [
    { id: 1, name: 'Solar Pump 1 - Manila' },
    { id: 2, name: 'Solar Pump 2 - Cebu' },
    { id: 3, name: 'Solar Pump 3 - Davao' },
    { id: 4, name: 'Solar Pump 4 - Baguio' },
    { id: 5, name: 'Solar Pump 5 - Iloilo' }
  ];

  // Load data when parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Instead of API calls, we'll use our simulator
        const data = {};
        for (const pumpId of selectedPumps) {
          data[pumpId] = generatePumpData(
            pumpId,
            interval,
            startDate,
            endDate
          );
        }
        setPumpData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPumps, interval, startDate, endDate]);

  // Helper function for date formatting
  const formatDateRange = (start, end) => {
    const formatDate = (date) => date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Helper functions for data calculations
  const calculateAverageMetric = (metric) => {
    let sum = 0;
    let count = 0;
    
    Object.entries(pumpData).forEach(([pumpId, data]) => {
      data.forEach(item => {
        sum += item[metric];
        count++;
      });
    });
    
    return count > 0 ? sum / count : 0;
  };

  const calculateTotalMetric = (metric) => {
    let total = 0;
    
    Object.entries(pumpData).forEach(([pumpId, data]) => {
      data.forEach(item => {
        total += item[metric];
      });
    });
    
    return total;
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h4 className="mb-1">Solar Pump Data Analysis</h4>
          <p className="text-muted">
            Monitor and analyze solar pump performance metrics over time
          </p>
        </Col>
        <Col md="auto" className="d-flex align-items-center">
          <div className="me-3 text-muted">
            {currentUser} | {currentDateTime}
          </div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: '#e2e8f0', 
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
              setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
              setEndDate(new Date());
              setInterval('daily');
            }}
          >
            <FontAwesomeIcon icon={faSync} className="me-2" />
            Reset Filters
          </Button>
          <Button 
            variant="primary" 
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              borderColor: '#3b82f6'
            }}
            onClick={() => alert('Data would be downloaded in a real application')}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Export Data
          </Button>
        </Col>
      </Row>

      {/* Filter controls */}
      <Row className="mb-4">
  <Col>
    <Card className="dashboard-card filter-card">
      <Card.Body className="py-3">
        <Row className="g-3 align-items-end filter-controls-container">
                {/* Pump Selector with improved styling */}
                <Col md={3} sm={6}>
                  <div className="filter-group">
                    <div className="filter-icon-bg">
                      <FontAwesomeIcon icon={faWater} className="filter-icon" />
                    </div>
                    <PumpSelector 
                      pumps={pumps} 
                      selectedPumps={selectedPumps} 
                      setSelectedPumps={setSelectedPumps} 
                    />
                  </div>
                </Col>
                
                {/* Metrics Selector with improved styling */}
                <Col md={3} sm={6}>
                  <div className="filter-group">
                    <div className="filter-icon-bg accent-blue">
                      <FontAwesomeIcon icon={faChartBar} className="filter-icon" />
                    </div>
                    <MetricSelector 
                      metrics={metrics} 
                      selectedMetrics={selectedMetrics} 
                      setSelectedMetrics={setSelectedMetrics} 
                    />
                  </div>
                </Col>
                
                {/* Interval Selector with improved styling */}
                <Col md={2} sm={6}>
                  <div className="filter-group">
                    <div className="filter-icon-bg accent-green">
                      <FontAwesomeIcon icon={faChartLine} className="filter-icon" />
                    </div>
                    <Form.Group>
                      <Form.Label className="filter-label">Data Interval</Form.Label>
                      <Form.Select 
                        value={interval} 
                        onChange={(e) => setInterval(e.target.value)}
                        className="filter-select"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Col>
                
                {/* Date Range Selector with improved styling */}
                <Col md={4} sm={12}>
                  <div className="filter-group">
                    <div className="filter-icon-bg accent-purple">
                      <FontAwesomeIcon icon={faCalendar} className="filter-icon" />
                    </div>
                    <div>
                      <Form.Label className="filter-label">Date Range</Form.Label>
                      <div className="date-range-container">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="form-control date-picker"
                          dateFormat="MM/dd/yyyy"
                        />
                        <span className="date-range-separator">to</span>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          className="form-control date-picker"
                          dateFormat="MM/dd/yyyy"
                        />
                      </div>
                      <div className="date-presets mt-2">
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="date-preset-btn"
                          onClick={() => {
                            const today = new Date();
                            setStartDate(today);
                            setEndDate(today);
                          }}
                        >
                          Today
                        </Button>
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="date-preset-btn"
                          onClick={() => {
                            const today = new Date();
                            const weekAgo = new Date();
                            weekAgo.setDate(today.getDate() - 7);
                            setStartDate(weekAgo);
                            setEndDate(today);
                          }}
                        >
                          Last 7 Days
                        </Button>
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="date-preset-btn"
                          onClick={() => {
                            const today = new Date();
                            const monthAgo = new Date();
                            monthAgo.setMonth(today.getMonth() - 1);
                            setStartDate(monthAgo);
                            setEndDate(today);
                          }}
                        >
                          Last 30 Days
                        </Button>
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="date-preset-btn"
                          onClick={() => {
                            const today = new Date();
                            const yearStart = new Date(today.getFullYear(), 0, 1);
                            setStartDate(yearStart);
                            setEndDate(today);
                          }}
                        >
                          Year to Date
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Cards */}
      <Row className="mb-4">
        {selectedPumps.length > 0 && selectedMetrics.length > 0 && (
          <>
            {selectedMetrics.includes('voltage') && (
              <Col md={3} sm={6} className="mb-3">
                <Card className="dashboard-card stat-card">
                  <Card.Body>
                    <div className="stat-icon-wrapper voltage-bg">
                      <FontAwesomeIcon icon={faBolt} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                      <h6 className="stat-label">Average Voltage</h6>
                      <h3 className="stat-value">
                        {loading ? (
                          <span className="loading-placeholder">--</span>
                        ) : (
                          `${calculateAverageMetric('voltage').toFixed(1)} V`
                        )}
                      </h3>
                      <small className="stat-change positive">
                        <FontAwesomeIcon icon={faArrowUp} /> 2.3% from previous
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {selectedMetrics.includes('power') && (
              <Col md={3} sm={6} className="mb-3">
                <Card className="dashboard-card stat-card">
                  <Card.Body>
                    <div className="stat-icon-wrapper power-bg">
                      <FontAwesomeIcon icon={faBolt} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                      <h6 className="stat-label">Average Power</h6>
                      <h3 className="stat-value">
                        {loading ? (
                          <span className="loading-placeholder">--</span>
                        ) : (
                          `${calculateAverageMetric('power').toFixed(1)} W`
                        )}
                      </h3>
                      <small className="stat-change negative">
                        <FontAwesomeIcon icon={faArrowDown} /> 1.5% from previous
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {selectedMetrics.includes('flow') && (
              <Col md={3} sm={6} className="mb-3">
                <Card className="dashboard-card stat-card">
                  <Card.Body>
                    <div className="stat-icon-wrapper flow-bg">
                      <FontAwesomeIcon icon={faTint} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                      <h6 className="stat-label">Total Flow</h6>
                      <h3 className="stat-value">
                        {loading ? (
                          <span className="loading-placeholder">--</span>
                        ) : (
                          `${calculateTotalMetric('flow').toFixed(1)} L/min`
                        )}
                      </h3>
                      <small className="stat-change positive">
                        <FontAwesomeIcon icon={faArrowUp} /> 4.7% from previous
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {selectedMetrics.includes('energy') && (
              <Col md={3} sm={6} className="mb-3">
                <Card className="dashboard-card stat-card">
                  <Card.Body>
                    <div className="stat-icon-wrapper energy-bg">
                      <FontAwesomeIcon icon={faChargingStation} className="stat-icon" />
                    </div>
                    <div className="stat-content">
                      <h6 className="stat-label">Total Energy</h6>
                      <h3 className="stat-value">
                        {loading ? (
                          <span className="loading-placeholder">--</span>
                        ) : (
                          `${(calculateTotalMetric('energy') / 1000).toFixed(2)} kWh`
                        )}
                      </h3>
                      <small className="stat-change positive">
                        <FontAwesomeIcon icon={faArrowUp} /> 3.2% from previous
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </>
        )}
      </Row>

      {/* Charts */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="chart-header d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">Performance Analysis</h5>
                  <p className="text-muted mb-0">
                    {!loading && selectedPumps.length > 0 && (
                      <>
                        <FontAwesomeIcon icon={faInfoCircle} className="me-1" /> 
                        Showing data for {formatDateRange(startDate, endDate)}
                      </>
                    )}
                  </p>
                </div>
                
                <div className="chart-controls d-flex">
                  <ButtonGroup className="chart-type-toggle me-2">
                    <Button 
                      size="sm" 
                      variant={chartType === 'line' ? 'primary' : 'outline-secondary'}
                      onClick={() => setChartType('line')}
                    >
                      <FontAwesomeIcon icon={faChartLine} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={chartType === 'bar' ? 'primary' : 'outline-secondary'}
                      onClick={() => setChartType('bar')}
                    >
                      <FontAwesomeIcon icon={faChartBar} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={chartType === 'area' ? 'primary' : 'outline-secondary'}
                      onClick={() => setChartType('area')}
                    >
                      <FontAwesomeIcon icon={faChartArea} />
                    </Button>
                  </ButtonGroup>
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" id="chart-settings">
                      <FontAwesomeIcon icon={faCog} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="chart-settings-menu">
                      <Dropdown.Item>
                        <Form.Check 
                          type="switch" 
                          id="show-grid-lines" 
                          label="Show Grid Lines" 
                          defaultChecked
                        />
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Form.Check 
                          type="switch" 
                          id="show-data-points" 
                          label="Show Data Points" 
                        />
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Form.Check 
                          type="switch" 
                          id="show-legend" 
                          label="Show Legend" 
                          defaultChecked
                        />
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => alert('Would download chart')}>
                        <FontAwesomeIcon icon={faDownload} className="me-2" />
                        Download Chart
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
                    
              {loading ? (
                <div className="chart-loading-state">
                  <div className="spinner-container">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <p className="text-center text-muted mt-3">Loading your data...</p>
                </div>
              ) : selectedPumps.length === 0 || selectedMetrics.length === 0 ? (
                <div className="chart-empty-state">
                  <div className="empty-icon">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <h5>No Data to Display</h5>
                  <p className="text-muted">
                    Select at least one pump and metric to visualize your data.
                  </p>
                </div>
              ) : (
                <div className="chart-container">
                  <DataChart 
                    pumpData={pumpData}
                    pumps={pumps}
                    metrics={metrics}
                    selectedMetrics={selectedMetrics}
                    interval={interval}
                    chartType={chartType}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Statistics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Summary Statistics</h5>
                <div>
                  <Button variant="link" className="text-decoration-none p-0" onClick={() => alert("Would export data")}>
                    <FontAwesomeIcon icon={faFileExport} className="me-1" />
                    Export Table
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary spinner-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted small">Calculating statistics...</p>
                </div>
              ) : selectedPumps.length === 0 || selectedMetrics.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-icon sm">
                    <FontAwesomeIcon icon={faTable} />
                  </div>
                  <p className="text-muted">Select pumps and metrics to generate statistics</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table stats-table">
                    <thead>
                      <tr>
                        <th>Pump</th>
                        {selectedMetrics.includes('voltage') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#3b82f6' }}></span>
                            Avg Voltage (V)
                          </th>
                        )}
                        {selectedMetrics.includes('current') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#ef4444' }}></span>
                            Avg Current (A)
                          </th>
                        )}
                        {selectedMetrics.includes('power') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#f59e0b' }}></span>
                            Avg Power (W)
                          </th>
                        )}
                        {selectedMetrics.includes('flow') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#22d3ee' }}></span>
                            Total Flow (L)
                          </th>
                        )}
                        {selectedMetrics.includes('energy') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#10b981' }}></span>
                            Total Energy (kWh)
                          </th>
                        )}
                        {selectedMetrics.includes('water_volume') && (
                          <th>
                            <span className="metric-color" style={{ backgroundColor: '#8b5cf6' }}></span>
                            Total Water (L)
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPumps.map(pumpId => {
                        const pump = pumps.find(p => p.id === pumpId);
                        const data = pumpData[pumpId] || [];
                        
                        // Calculate summary stats
                        let avgVoltage = 0;
                        let avgCurrent = 0;
                        let avgPower = 0;
                        let totalFlow = 0;
                        let totalEnergy = 0;
                        let totalWater = 0;
                        
                        if (data.length > 0) {
                          avgVoltage = data.reduce((sum, item) => sum + item.voltage, 0) / data.length;
                          avgCurrent = data.reduce((sum, item) => sum + item.current, 0) / data.length;
                          avgPower = data.reduce((sum, item) => sum + item.power, 0) / data.length;
                          totalFlow = data.reduce((sum, item) => sum + item.flow, 0);
                          totalEnergy = data.reduce((sum, item) => sum + item.energy, 0) / 1000; // Convert to kWh
                          totalWater = data.reduce((sum, item) => sum + item.water_volume, 0);
                        }
                        
                        return (
                          <tr key={pumpId}>
                            <td>
                              <div className="pump-name">
                                <span className="pump-indicator"></span>
                                {pump?.name}
                              </div>
                            </td>
                            {selectedMetrics.includes('voltage') && (
                              <td className="stat-highlight">{avgVoltage.toFixed(2)}</td>
                            )}
                            {selectedMetrics.includes('current') && (
                              <td className="stat-highlight">{avgCurrent.toFixed(2)}</td>
                            )}
                            {selectedMetrics.includes('power') && (
                              <td className="stat-highlight">{avgPower.toFixed(2)}</td>
                            )}
                            {selectedMetrics.includes('flow') && (
                              <td className="stat-highlight">{totalFlow.toFixed(2)}</td>
                            )}
                            {selectedMetrics.includes('energy') && (
                              <td className="stat-highlight">{totalEnergy.toFixed(2)}</td>
                            )}
                            {selectedMetrics.includes('water_volume') && (
                              <td className="stat-highlight">{totalWater.toFixed(2)}</td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DataPage;