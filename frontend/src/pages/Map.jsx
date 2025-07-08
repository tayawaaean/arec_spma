import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import MapView from '../components/map/MapView';
import PumpOverview from '../components/map/PumpOverview';
import PumpModels from '../components/map/PumpModels';
import WeatherConditions from '../components/map/WeatherConditions';
import RecentActivity from '../components/map/RecentActivity';
import MapHeader from '../components/map/MapHeader';
import StatusFilter from '../components/map/StatusFilter';

// Import the utilities and data
import { 
  solarPumps, 
  calculateTotalPower, 
  countPumpsByStatus, 
  groupPumpsByModel, 
  countTotalPanels 
} from '../utils/solarPumpData';

import { APP_INFO } from '../utils/constants';

const MapPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarTab, setSidebarTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the data from constants
  const { currentDateTime, currentUser } = APP_INFO;
  
  // Get stats using utility functions
  const totalPower = calculateTotalPower(solarPumps);
  const pumpsByStatus = countPumpsByStatus(solarPumps);
  const pumpsByModel = groupPumpsByModel(solarPumps);
  const totalPanels = countTotalPanels(solarPumps);
  
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };
  
  return (
    <Container fluid className="h-100 pb-3">
      <MapHeader currentUser={currentUser} currentDateTime={currentDateTime} />
      
      <StatusFilter 
        statusFilter={statusFilter}
        handleStatusFilter={handleStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <Row className="flex-fill h-100" style={{ minHeight: '700px' }}>
        <Col md={9} className="h-100">
          <div className="dashboard-card h-100" style={{ padding: '0', overflow: 'hidden' }}>
            <MapView statusFilter={statusFilter} />
          </div>
        </Col>
        <Col md={3} className="d-flex flex-column h-100">
          <Card className="dashboard-card flex-grow-0 mb-3">
            <Card.Body className="p-0">
              <Nav variant="tabs" className="map-sidebar-tabs">
                <Nav.Item>
                  <Nav.Link 
                    className={sidebarTab === 'overview' ? 'active' : ''} 
                    onClick={() => setSidebarTab('overview')}
                  >
                    Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={sidebarTab === 'models' ? 'active' : ''} 
                    onClick={() => setSidebarTab('models')}
                  >
                    Models
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={sidebarTab === 'weather' ? 'active' : ''} 
                    onClick={() => setSidebarTab('weather')}
                  >
                    Weather
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              <div className="tab-content p-3">
                {sidebarTab === 'overview' && (
                  <PumpOverview 
                    totalPower={totalPower}
                    pumpsByStatus={pumpsByStatus}
                    totalPumps={solarPumps.length}
                    totalPanels={totalPanels}
                  />
                )}
                
                {sidebarTab === 'models' && (
                  <PumpModels pumpsByModel={pumpsByModel} />
                )}
                
                {sidebarTab === 'weather' && (
                  <WeatherConditions />
                )}
              </div>
            </Card.Body>
          </Card>
          
          <Card className="dashboard-card flex-grow-1">
            <Card.Body>
              <RecentActivity />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MapPage;