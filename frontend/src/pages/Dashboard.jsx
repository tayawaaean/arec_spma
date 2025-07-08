import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import SolarStats from '../components/dashboard/SolarStats';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import MonthlyGeneration from '../components/dashboard/MonthlyGeneration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const currentUser = 'Dextiee';
  const currentDateTime = '2025-07-08 03:45:25';

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container fluid className="dashboard-container p-0">
      <div className="dashboard-header d-flex justify-content-between align-items-center mb-3">
        <h4>Solar Pump Dashboard</h4>
        <div className="dashboard-controls d-flex align-items-center">
          <small className="text-muted me-3">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </small>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm" id="time-range">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              {timeRange === 'day' ? 'Today' : 
               timeRange === 'week' ? 'This Week' : 'This Month'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTimeRange('day')}>Today</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeRange('week')}>This Week</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeRange('month')}>This Month</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={isLoading ? "fa-spin me-2" : "me-2"} 
            />
            Refresh
          </Button>
        </div>
      </div>
      
      <Row className="mb-3">
        <Col md={8}>
          <SolarStats 
            timeRange={timeRange} 
            currentUser={currentUser} 
            currentDateTime={currentDateTime}
          />
        </Col>
        <Col md={4}>
          <WeatherWidget />
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <PerformanceChart timeRange={timeRange} />
        </Col>
        <Col md={4}>
          <MonthlyGeneration />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;