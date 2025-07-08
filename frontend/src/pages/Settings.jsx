import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faServer, faNetworkWired, faMoneyBillWave, faBell
} from '@fortawesome/free-solid-svg-icons';
import MqttSettings from '../components/settings/MqttSettings';
import PricesSettings from '../components/settings/PricesSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('mqtt');
  const [notification, setNotification] = useState(null);
  
  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">System Settings</h4>
          <p className="text-muted">
            Configure system settings and connections for the solar monitoring platform
          </p>
        </Col>
      </Row>
      
      {/* Notification area */}
      {notification && (
        <Row className="mb-4">
          <Col>
            <Alert 
              variant={notification.type} 
              onClose={() => setNotification(null)} 
              dismissible
            >
              {notification.message}
            </Alert>
          </Col>
        </Row>
      )}
      
      {/* Settings Tabs */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Row>
                  <Col md={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="mqtt" 
                          style={activeTab === 'mqtt' ? 
                            { backgroundColor: 'var(--blue-accent)' } : 
                            { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                          }
                        >
                          <FontAwesomeIcon icon={faNetworkWired} className="me-2" /> 
                          MQTT Connection
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="prices" 
                          style={activeTab === 'prices' ? 
                            { backgroundColor: 'var(--blue-accent)' } : 
                            { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                          }
                        >
                          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> 
                          Price Settings
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="server" 
                          style={activeTab === 'server' ? 
                            { backgroundColor: 'var(--blue-accent)' } : 
                            { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                          }
                          disabled
                        >
                          <FontAwesomeIcon icon={faServer} className="me-2" /> 
                          Server Configuration
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="notifications" 
                          style={activeTab === 'notifications' ? 
                            { backgroundColor: 'var(--blue-accent)' } : 
                            { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                          }
                          disabled
                        >
                          <FontAwesomeIcon icon={faBell} className="me-2" /> 
                          Notification Settings
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col md={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="mqtt">
                        <MqttSettings 
                          showNotification={showNotification}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="prices">
                        <PricesSettings 
                          showNotification={showNotification}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="server">
                        <div className="p-4 text-center text-muted">
                          Server configuration settings will be available in a future update.
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="notifications">
                        <div className="p-4 text-center text-muted">
                          Notification settings will be available in a future update.
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;