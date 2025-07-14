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
import axios from "axios";
import DataChart from '../components/data/DataChart';
import PumpSelector from '../components/data/PumpSelector';
import MetricSelector from '../components/data/MetricSelector';
import { pumpService } from '../utils/pumpApi'; // adjust path as needed
import '../styles/DataPage.css';

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper function to fetch aggregated pump data for a single pump
const fetchAggregatePumpData = async (solarPumpNumber, interval, start, end) => {
  const params = new URLSearchParams();
  if (interval) params.append('interval', interval);
  if (start) params.append('start', start.toISOString());
  if (end) params.append('end', end.toISOString());
  const headers = getAuthHeaders();
  if (!headers.Authorization) {
    throw new Error("No access token found. Please login first.");
  }
  const res = await axios.get(
    `http://localhost:5000/api/pump-data/aggregate/${solarPumpNumber}?${params.toString()}`,
    { headers }
  );
  return res.data;
};

// Helper to fetch aggregate for all pumps
const fetchAggregateAllPumpsData = async (interval, start, end) => {
  const params = new URLSearchParams();
  if (interval) params.append('interval', interval);
  if (start) params.append('start', start.toISOString());
  if (end) params.append('end', end.toISOString());
  const headers = getAuthHeaders();
  if (!headers.Authorization) {
    throw new Error("No access token found. Please login first.");
  }
  const res = await axios.get(
    `http://localhost:5000/api/pump-data/aggregate/all?${params.toString()}`,
    { headers }
  );
  return res.data;
};

// Helper to display pump as "Pump 2 - Municipality"
function getPumpDisplayName(pump) {
  if (!pump) return '';
  return `Pump ${pump.solarPumpNumber}${pump.address?.municipality ? ' - ' + pump.address.municipality : ''}`;
}

const ALL_PUMPS_ID = 'all';

const DataPage = () => {
  // State management
  const [pumps, setPumps] = useState([]);
  const [selectedPumps, setSelectedPumps] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['voltage']);
  const [interval, setInterval] = useState('daily');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [pumpData, setPumpData] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  // Current user and time
  const currentUser = 'Dextiee';
  const currentDateTime = '2025-07-10 05:49:39';

  // Metrics options (static)
  const metrics = [
    { value: 'voltage', label: 'Voltage (V)', color: '#3b82f6' },
    { value: 'current', label: 'Current (A)', color: '#ef4444' },
    { value: 'power', label: 'Power (W)', color: '#f59e0b' },
    { value: 'flow', label: 'Water Flow (L/min)', color: '#22d3ee' },
    { value: 'energy', label: 'Energy (Wh)', color: '#10b981' },
    { value: 'water_volume', label: 'Water Volume (L)', color: '#8b5cf6' }
  ];

  // Fetch pumps from API on mount and map to { id, name, solarPumpNumber }
  useEffect(() => {
    async function fetchPumps() {
      try {
        const { data } = await pumpService.getAllPumps();
        // Add "All Pumps" as the first item
        const mapped = [
          { id: ALL_PUMPS_ID, name: 'All Pumps', isAll: true },
          ...(data || []).map((pump) => ({
            id: pump._id,
            name: getPumpDisplayName(pump),
            solarPumpNumber: pump.solarPumpNumber,
            address: pump.address,
            ...pump
          }))
        ];
        setPumps(mapped);
        if (mapped.length > 0) setSelectedPumps([mapped[0].id]);
      } catch (err) {
        console.error('Failed to fetch pumps', err);
      }
    }
    fetchPumps();
  }, []);

  // Fetch real data from aggregate API using solarPumpNumber or all
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // If "All Pumps" selected
        if (selectedPumps.includes(ALL_PUMPS_ID)) {
          const aggAllData = await fetchAggregateAllPumpsData(interval, startDate, endDate);
          // aggAllData is expected as: { [solarPumpNumber]: { intervalData, summary } }
          // Map it into our shape
          const newPumpData = {};
          const newSummary = {};
          Object.entries(aggAllData).forEach(([solarPumpNumber, agg]) => {
            // Find pump by solarPumpNumber
            const pump = pumps.find(p => p.solarPumpNumber === Number(solarPumpNumber));
            const pumpId = pump ? pump.id : solarPumpNumber;
            newPumpData[pumpId] = (agg.intervalData || []).map(item => ({
              timestamp: item._id,
              voltage: item.avg_voltage,
              current: item.avg_current,
              power: item.avg_power,
              flow: item.total_flow,
              energy: item.total_energy_wh,
              water_volume: item.total_water_volume,
            }));
            newSummary[pumpId] = agg.summary;
          });
          setPumpData(newPumpData);
          setSummary(newSummary);
        } else {
          // Individual/multiple pump mode
          const newPumpData = {};
          const newSummary = {};
          for (const pumpId of selectedPumps) {
            const pump = pumps.find(p => p.id === pumpId);
            if (!pump) continue;
            const agg = await fetchAggregatePumpData(
              pump.solarPumpNumber,
              interval,
              startDate,
              endDate
            );
            newPumpData[pumpId] = (agg.intervalData || []).map(item => ({
              timestamp: item._id,
              voltage: item.avg_voltage,
              current: item.avg_current,
              power: item.avg_power,
              flow: item.total_flow,
              energy: item.total_energy_wh,
              water_volume: item.total_water_volume,
            }));
            newSummary[pumpId] = agg.summary;
          }
          setPumpData(newPumpData);
          setSummary(newSummary);
        }
      } catch (error) {
        console.error('Error fetching pump data:', error);
        setPumpData({});
        setSummary({});
      } finally {
        setLoading(false);
      }
    };

    if (selectedPumps.length > 0) {
      fetchData();
    } else {
      setPumpData({});
      setSummary({});
      setLoading(false);
    }
  }, [selectedPumps, interval, startDate, endDate, pumps]);

  // Helper function for date formatting
  const formatDateRange = (start, end) => {
    const formatDate = (date) => date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Helper functions for data calculations (using summary if available)
  const calculateAverageMetric = (metric) => {
    let sum = 0;
    let count = 0;
    Object.keys(summary).forEach(pumpId => {
      const summ = summary[pumpId];
      if (summ && summ[`avg_${metric}`] != null) {
        sum += summ[`avg_${metric}`];
        count++;
      }
    });
    return count > 0 ? sum / count : 0;
  };

  const calculateTotalMetric = (metric) => {
    let total = 0;
    Object.keys(summary).forEach(pumpId => {
      const summ = summary[pumpId];
      // Special case for energy
      if (metric === 'energy') {
        if (summ && summ['total_energy_wh'] != null) {
          total += summ['total_energy_wh'];
        }
      } else {
        if (summ && summ[`total_${metric}`] != null) {
          total += summ[`total_${metric}`];
        }
      }
    });
    return total;
  };

  // Helper for displaying max metric
  const getMaxMetric = (summ, field) =>
    summ && summ[field] != null ? summ[field].toFixed(2) : '--';


  // ==== COMPACT FILTER CONTROLS START HERE ====
  return (
    <Container fluid className="data-page-root">
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

      {/* COMPACT FILTER CONTROLS */}
      <Row className="mb-3">
        <Col>
          <Card className="dashboard-card filter-card">
            <Card.Body className="py-2">
              <div className="filter-controls-container compact">
                {/* Compact Pump Selector */}
                <div className="filter-group compact d-flex align-items-center gap-2" style={{width: '100%'}}>
  <div
    className="pump-selector-card"
    style={{
      background: "#232735",
      borderRadius: "14px",
      padding: "1.05rem 1.2rem 1.05rem 1rem",
      boxShadow: "0 2px 8px 0 rgba(50,80,200,0.04)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      border: "1.5px solid #232941",
      minWidth: 220,
      width: "100%",
      height: "100%",
      position: "relative"
    }}
  >
    <Form.Label className="filter-label d-flex align-items-center mb-2" style={{ gap: 7, fontWeight: 600 }}>
      <span className="filter-icon-bg accent-blue" style={{ marginRight: 10, width: 30, height: 30, minWidth: 30 }}>
        <FontAwesomeIcon icon={faWater} className="filter-icon" style={{ fontSize: '1.1rem' }} />
      </span>
      Select Pumps <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
    </Form.Label>
    <PumpSelector
      pumps={pumps}
      selectedPumps={selectedPumps}
      setSelectedPumps={setSelectedPumps}
      allPumpsId={ALL_PUMPS_ID}
      compact
    />
    {pumps.length === 0 && <span className="text-danger ms-1 small">No pumps found.</span>}
  </div>
</div>
                {/* Compact Metric Selector */}
                <div className="filter-group compact d-flex align-items-center gap-2">
                  <MetricSelector
                    metrics={metrics}
                    selectedMetrics={selectedMetrics}
                    setSelectedMetrics={setSelectedMetrics}
                    compact
                  />
                </div>
                {/* Compact Interval */}
               {/* Compact Data Interval Selector - Consistent with others */}
<div className="filter-group compact d-flex align-items-center gap-2" style={{width: '100%'}}>
  <div
    className="interval-selector-card"
    style={{
      background: "#232735",
      borderRadius: "14px",
      padding: "1.05rem 1.2rem 1.05rem 1rem",
      boxShadow: "0 2px 8px 0 rgba(50,80,200,0.04)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      border: "1.5px solid #232941",
      minWidth: 220,
      width: "100%",
      height: "100%",
      position: "relative"
    }}
  >
    <Form.Label className="filter-label d-flex align-items-center mb-2" style={{ gap: 7, fontWeight: 600 }}>
      <span className="filter-icon-bg accent-green" style={{ marginRight: 10, width: 30, height: 30, minWidth: 30 }}>
        <FontAwesomeIcon icon={faChartLine} className="filter-icon" style={{ fontSize: '1.1rem' }} />
      </span>
      Data Interval <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
    </Form.Label>
    <Form.Select
      value={interval}
      onChange={(e) => setInterval(e.target.value)}
      className="interval-select"
      style={{
        background: "#20242e",
        border: "1.5px solid #20242e",
        color: "#f1f6fa",
        fontWeight: 600,
        minHeight: 44,
        borderRadius: 8,
        padding: "0.48rem 1.1rem",
        fontSize: "1.08rem",
        width: "100%",
        outline: "none",
        boxShadow: "none"
      }}
    >
      <option value="hourly">Hourly</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </Form.Select>
  </div>
</div>
                {/* Compact Date Range */}
                <div className="filter-group compact d-flex align-items-center gap-2">
                  <span className="filter-icon-bg accent-purple me-2" style={{minWidth: 24, minHeight: 24, width: 24, height: 24}}>
                    <FontAwesomeIcon icon={faCalendar} className="filter-icon" style={{fontSize: 15}} />
                  </span>
                  <div className="w-100">
                    <Form.Label className="filter-label mb-0" style={{fontSize: '0.94rem'}}>Date Range</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="custom-date-input"
                      dateFormat="MM/dd/yyyy"
                      popperPlacement="bottom"   // <-- Add this line
                    />

                      <span className="date-range-separator mx-1">to</span>

                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="custom-date-input"
                        dateFormat="MM/dd/yyyy"
                          popperPlacement="bottom"
                      />
                    </div>
                    <div className="date-presets mt-1 d-flex gap-1 flex-wrap">
                      <Button size="sm" variant="link" className="date-preset-btn p-0" onClick={() => { const today = new Date(); setStartDate(today); setEndDate(today); }}>Today</Button>
                      <Button size="sm" variant="link" className="date-preset-btn p-0" onClick={() => { const today = new Date(); const weekAgo = new Date(); weekAgo.setDate(today.getDate() - 7); setStartDate(weekAgo); setEndDate(today); }}>Last 7 Days</Button>
                      <Button size="sm" variant="link" className="date-preset-btn p-0" onClick={() => { const today = new Date(); const monthAgo = new Date(); monthAgo.setMonth(today.getMonth() - 1); setStartDate(monthAgo); setEndDate(today); }}>Last 30 Days</Button>
                      <Button size="sm" variant="link" className="date-preset-btn p-0" onClick={() => { const today = new Date(); const yearStart = new Date(today.getFullYear(), 0, 1); setStartDate(yearStart); setEndDate(today); }}>Year to Date</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* ==== END COMPACT FILTER CONTROLS ==== */}

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
                    getPumpDisplayName={getPumpDisplayName}
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
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#3b82f6' }}></span>
                              Avg Voltage (V)
                            </th>
                            <th>Max Voltage (V)</th>
                          </>
                        )}
                        {selectedMetrics.includes('current') && (
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#ef4444' }}></span>
                              Avg Current (A)
                            </th>
                            <th>Max Current (A)</th>
                          </>
                        )}
                        {selectedMetrics.includes('power') && (
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#f59e0b' }}></span>
                              Avg Power (W)
                            </th>
                            <th>Max Power (W)</th>
                          </>
                        )}
                        {selectedMetrics.includes('flow') && (
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#22d3ee' }}></span>
                              Total Flow (L)
                            </th>
                            <th>Max Flow (L/min)</th>
                          </>
                        )}
                        {selectedMetrics.includes('energy') && (
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#10b981' }}></span>
                              Total Energy (kWh)
                            </th>
                            {/* No max energy */}
                          </>
                        )}
                        {selectedMetrics.includes('water_volume') && (
                          <>
                            <th>
                              <span className="metric-color" style={{ backgroundColor: '#8b5cf6' }}></span>
                              Total Water (L)
                            </th>
                            {/* REMOVED <th>Max Water (L)</th> */}
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPumps.map(pumpId => {
                        const pump = pumps.find(p => p.id === pumpId);
                        const summ = summary[pumpId] || {};
                        return (
                          <tr key={pumpId}>
                            <td>
                              <div className="pump-name">
                                <span className="pump-indicator"></span>
                                {getPumpDisplayName(pump)}
                              </div>
                            </td>
                            {selectedMetrics.includes('voltage') && (
                              <>
                                <td className="stat-highlight">{summ.avg_voltage != null ? summ.avg_voltage.toFixed(2) : '--'}</td>
                                <td>{getMaxMetric(summ, 'max_voltage')}</td>
                              </>
                            )}
                            {selectedMetrics.includes('current') && (
                              <>
                                <td className="stat-highlight">{summ.avg_current != null ? summ.avg_current.toFixed(2) : '--'}</td>
                                <td>{getMaxMetric(summ, 'max_current')}</td>
                              </>
                            )}
                            {selectedMetrics.includes('power') && (
                              <>
                                <td className="stat-highlight">{summ.avg_power != null ? summ.avg_power.toFixed(2) : '--'}</td>
                                <td>{getMaxMetric(summ, 'max_power')}</td>
                              </>
                            )}
                            {selectedMetrics.includes('flow') && (
                              <>
                                <td className="stat-highlight">{summ.total_flow != null ? summ.total_flow.toFixed(2) : '--'}</td>
                                <td>{getMaxMetric(summ, 'max_flow')}</td>
                              </>
                            )}
                            {selectedMetrics.includes('energy') && (
                              <>
                                <td className="stat-highlight">{summ.total_energy_wh != null ? (summ.total_energy_wh / 1000).toFixed(2) : '--'}</td>
                                {/* No max_energy_wh */}
                              </>
                            )}
                            {selectedMetrics.includes('water_volume') && (
                              <>
                                <td className="stat-highlight">{summ.total_water_volume != null ? summ.total_water_volume.toFixed(2) : '--'}</td>
                                {/* REMOVED <td>{getMaxMetric(summ, 'max_water_volume')}</td> */}
                              </>
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