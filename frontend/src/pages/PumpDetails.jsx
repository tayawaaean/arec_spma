import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Nav, 
  Spinner, Alert, Table, Badge, Breadcrumb 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faInfoCircle, faTachometerAlt, faChartLine, 
  faHistory, faWrench, faTint, faBolt, faSolarPanel
} from '@fortawesome/free-solid-svg-icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

import { solarPumps } from '../utils/solarPumpData';
import { APP_INFO } from '../utils/constants';
import { getPumpRealTimeMetrics, getPumpHistoricalMetrics } from '../services/pumpMetricsService';

// Import the real-time metrics component
import RealTimePumpMetrics from '../components/map/RealTimePumpMetrics';

const PumpDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pumpData, setPumpData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  
  // Get the current date in ISO format for history end date
  const currentDate = new Date().toISOString();
  // Get date 30 days ago for history start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const startDateIso = startDate.toISOString();
  
  useEffect(() => {
    // Find the pump by ID
    const pump = solarPumps.find(p => p._id === id);
    if (pump) {
      setPumpData(pump);
    }
    setLoading(false);
  }, [id]);
  
  useEffect(() => {
    if (activeTab === 'performance' && pumpData && !historicalData) {
      setHistoricalLoading(true);
      getPumpHistoricalMetrics(pumpData._id, startDateIso, currentDate)
        .then(data => {
          setHistoricalData(data);
        })
        .finally(() => {
          setHistoricalLoading(false);
        });
    }
  }, [activeTab, pumpData, historicalData]);
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'maintenance':
        return <Badge bg="warning">Maintenance</Badge>;
      case 'offline':
        return <Badge bg="danger">Offline</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading pump details...</p>
      </Container>
    );
  }
  
  if (!pumpData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Pump Not Found</Alert.Heading>
          <p>
            The pump with ID {id} could not be found. Please check the ID and try again.
          </p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/map')}>
              Return to Map
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container fluid className="py-4">
      {/* Header with breadcrumbs */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Breadcrumb>
                <Breadcrumb.Item onClick={() => navigate('/map')}>Map</Breadcrumb.Item>
                <Breadcrumb.Item active>Pump #{pumpData.solarPumpNumber}</Breadcrumb.Item>
              </Breadcrumb>
              <h3 className="mb-1">
                Solar Pump #{pumpData.solarPumpNumber} - {pumpData.model}
                <span className="ms-2">{getStatusBadge(pumpData.status)}</span>
              </h3>
              <p className="text-muted">
                Location: {pumpData.address.barangay}, {pumpData.address.municipality}, {pumpData.address.region}
              </p>
            </div>
            <div className="d-flex gap-2">
              <span className="text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                {APP_INFO.currentUser} | {APP_INFO.currentDateTime}
              </span>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => navigate('/map')}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back to Map
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Navigation tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'performance'} 
                onClick={() => setActiveTab('performance')}
              >
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                Performance History
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'maintenance'} 
                onClick={() => setActiveTab('maintenance')}
              >
                <FontAwesomeIcon icon={faWrench} className="me-2" />
                Maintenance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'logs'} 
                onClick={() => setActiveTab('logs')}
              >
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Event Logs
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <Row>
          {/* Real-time metrics card */}
          <Col md={4}>
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Real-Time Performance</h5>
              </Card.Header>
              <Card.Body>
                <RealTimePumpMetrics pumpId={pumpData._id} />
              </Card.Body>
            </Card>
            
            {/* Pump location card */}
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Location Details</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless size="sm" className="mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted">Barangay</td>
                      <td>{pumpData.address.barangay}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Municipality</td>
                      <td>{pumpData.address.municipality}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Region</td>
                      <td>{pumpData.address.region}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Coordinates</td>
                      <td>{pumpData.lat.toFixed(4)}, {pumpData.lng.toFixed(4)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Technical specifications */}
          <Col md={8}>
            <Card className="dashboard-card">
              <Card.Header>
                <h5 className="mb-0">Technical Specifications</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="spec-group">
                      <h6 className="mb-3">
                        <FontAwesomeIcon icon={faSolarPanel} className="text-primary me-2" />
                        General Specs
                      </h6>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Model</td>
                            <td>{pumpData.model}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Power Rating</td>
                            <td>{pumpData.power}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Installation Date</td>
                            <td>{new Date(pumpData.timeInstalled).toLocaleDateString()}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Last Updated</td>
                            <td>{new Date(pumpData.updatedAt).toLocaleDateString()}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="spec-group">
                      <h6 className="mb-3">
                        <FontAwesomeIcon icon={faBolt} className="text-warning me-2" />
                        Electrical Specs
                      </h6>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">AC Input</td>
                            <td>{pumpData.acInputVoltage}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">PV Operating</td>
                            <td>{pumpData.pvOperatingVoltage}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Open Circuit</td>
                            <td>{pumpData.openCircuitVoltage}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Solar Panel</td>
                            <td>{pumpData.solarPanelConfig}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="spec-group">
                      <h6 className="mb-3">
                        <FontAwesomeIcon icon={faTint} className="text-info me-2" />
                        Water Specs
                      </h6>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Outlet Size</td>
                            <td>{pumpData.outlet}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Max Head</td>
                            <td>{pumpData.maxHead}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Max Flow</td>
                            <td>{pumpData.maxFlow}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
                
                <hr />
                
                <h5 className="mb-3">Performance Summary</h5>
                <Row>
                  <Col md={6}>
                    <Card className="text-white bg-primary mb-4">
                      <Card.Body>
                        <h3 className="mb-1">85%</h3>
                        <p className="mb-0">Average Efficiency</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-white bg-success mb-4">
                      <Card.Body>
                        <h3 className="mb-1">99.2%</h3>
                        <p className="mb-0">Uptime this Month</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-dark bg-warning mb-4">
                      <Card.Body>
                        <h3 className="mb-1">4,582 m³</h3>
                        <p className="mb-0">Total Water Pumped</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-white bg-info mb-4">
                      <Card.Body>
                        <h3 className="mb-1">152 kWh</h3>
                        <p className="mb-0">Energy Generated</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {activeTab === 'performance' && (
        <Row>
          <Col>
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Performance History (Last 30 Days)</h5>
              </Card.Header>
              <Card.Body>
                {historicalLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading historical data...</p>
                  </div>
                ) : historicalData ? (
                  <>
                    <Row className="mb-4">
                      <Col md={3}>
                        <Card className="text-center py-3 bg-light">
                          <div className="small text-muted">Avg. Efficiency</div>
                          <div className="h3">{historicalData.summary.avgEfficiency}%</div>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center py-3 bg-light">
                          <div className="small text-muted">Avg. Flow Rate</div>
                          <div className="h3">{historicalData.summary.avgFlow} m³/h</div>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center py-3 bg-light">
                          <div className="small text-muted">Avg. Power Output</div>
                          <div className="h3">{historicalData.summary.avgPowerOutput} kW</div>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center py-3 bg-light">
                          <div className="small text-muted">Total Water Pumped</div>
                          <div className="h3">{historicalData.summary.totalWaterPumped} m³</div>
                        </Card>
                      </Col>
                    </Row>
                    
                    <h6 className="mb-3">Efficiency & Flow Rate Trends</h6>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={historicalData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <RechartsTooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="efficiency" 
                          name="Efficiency (%)" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="flow" 
                          name="Flow Rate (m³/h)" 
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    <h6 className="mt-5 mb-3">Power Output Over Time</h6>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={historicalData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="powerOutput" name="Power Output (kW)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <Alert variant="info">
                    No historical data available for this pump.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {activeTab === 'maintenance' && (
        <Row>
          <Col>
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Maintenance Records</h5>
                  <Button variant="primary" size="sm">
                    <FontAwesomeIcon icon={faWrench} className="me-1" />
                    Schedule Maintenance
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Technician</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-06-15</td>
                      <td>Regular</td>
                      <td>Quarterly maintenance check</td>
                      <td>Juan Cruz</td>
                      <td><Badge bg="success">Completed</Badge></td>
                      <td><Button size="sm" variant="link">View</Button></td>
                    </tr>
                    <tr>
                      <td>2025-05-03</td>
                      <td>Repair</td>
                      <td>Replaced faulty pressure sensor</td>
                      <td>Maria Santos</td>
                      <td><Badge bg="success">Completed</Badge></td>
                      <td><Button size="sm" variant="link">View</Button></td>
                    </tr>
                    <tr>
                      <td>2025-07-25</td>
                      <td>Regular</td>
                      <td>Solar panel cleaning</td>
                      <td>Not assigned</td>
                      <td><Badge bg="warning">Scheduled</Badge></td>
                      <td><Button size="sm" variant="link">View</Button></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            
            <Card className="dashboard-card">
              <Card.Header>
                <h5 className="mb-0">Spare Parts Inventory</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Part Name</th>
                      <th>Compatible</th>
                      <th>In Stock</th>
                      <th>Last Replaced</th>
                      <th>Recommended Replacement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pressure Sensor</td>
                      <td>Yes</td>
                      <td>3</td>
                      <td>2025-05-03</td>
                      <td>Every 2 years</td>
                    </tr>
                    <tr>
                      <td>Controller Board</td>
                      <td>Yes</td>
                      <td>1</td>
                      <td>Never</td>
                      <td>As needed</td>
                    </tr>
                    <tr>
                      <td>Water Filter</td>
                      <td>Yes</td>
                      <td>5</td>
                      <td>2025-06-15</td>
                      <td>Every 3 months</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {activeTab === 'logs' && (
        <Row>
          <Col>
            <Card className="dashboard-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Event Logs</h5>
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2">
                      Filter
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      Export Logs
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Event Type</th>
                      <th>Description</th>
                      <th>User</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-07-08 04:15:33</td>
                      <td>Status Change</td>
                      <td>Pump status changed to Active</td>
                      <td>System</td>
                      <td><Badge bg="info">Info</Badge></td>
                    </tr>
                    <tr>
                      <td>2025-07-07 18:32:10</td>
                      <td>Voltage Alert</td>
                      <td>Low voltage detected (185V)</td>
                      <td>System</td>
                      <td><Badge bg="warning">Warning</Badge></td>
                    </tr>
                    <tr>
                      <td>2025-07-06 09:15:22</td>
                      <td>Maintenance</td>
                      <td>Regular maintenance completed</td>
                      <td>Juan Cruz</td>
                      <td><Badge bg="info">Info</Badge></td>
                    </tr>
                    <tr>
                      <td>2025-06-30 11:42:05</td>
                      <td>Flow Rate</td>
                      <td>Flow rate below threshold (3.2 m³/h)</td>
                      <td>System</td>
                      <td><Badge bg="warning">Warning</Badge></td>
                    </tr>
                    <tr>
                      <td>2025-06-28 14:18:33</td>
                      <td>Temperature</td>
                      <td>High panel temperature detected (48°C)</td>
                      <td>System</td>
                      <td><Badge bg="danger">Alert</Badge></td>
                    </tr>
                    <tr>
                      <td>2025-06-25 09:00:00</td>
                      <td>Installation</td>
                      <td>New panel configuration installed</td>
                      <td>Maria Santos</td>
                      <td><Badge bg="success">Success</Badge></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PumpDetails;