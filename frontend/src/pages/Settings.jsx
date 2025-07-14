import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faServer, faNetworkWired, faMoneyBillWave, faBell, faCog
} from '@fortawesome/free-solid-svg-icons';
import MqttSettings from '../components/settings/MqttSettings';
import PricesSettings from '../components/settings/PricesSettings';
import '../styles/settings.css';

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
    <Container fluid className="settings-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <div className="settings-header-icon">
              <FontAwesomeIcon icon={faCog} />
            </div>
            <div>
              <h4 className="mb-1" style={{color: '#ffffff', fontWeight: 'bold'}}>System Settings</h4>
              <p style={{color: '#d1d5db', fontSize: '1rem'}}>
                Configure system settings and connections for the solar monitoring platform
              </p>
            </div>
          </div>
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
              style={{
                borderWidth: '1px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              {notification.message}
            </Alert>
          </Col>
        </Row>
      )}
      
      {/* Settings Tabs */}
      <Row>
        <Col>
          <Card className="settings-main-card" style={{backgroundColor: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Row>
                  <Col md={3}>
                    <Nav variant="pills" className="flex-column settings-nav">
                      <Nav.Item className="settings-nav-item mb-2">
                        <Nav.Link 
                          eventKey="mqtt" 
                          style={{
                            padding: '1rem 1.25rem',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'mqtt' ? '600' : '400',
                            borderRadius: '8px'
                          }}
                          className={activeTab === 'mqtt' ? 'active shadow-sm' : ''}
                        >
                          <FontAwesomeIcon icon={faNetworkWired} className="me-3" style={{width: '20px'}} /> 
                          <span style={{color: activeTab === 'mqtt' ? '#ffffff' : '#d1d5db'}}>MQTT Connection</span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="settings-nav-item mb-2">
                        <Nav.Link 
                          eventKey="prices" 
                          style={{
                            padding: '1rem 1.25rem',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'prices' ? '600' : '400',
                            borderRadius: '8px'
                          }}
                          className={activeTab === 'prices' ? 'active shadow-sm' : ''}
                        >
                          <FontAwesomeIcon icon={faMoneyBillWave} className="me-3" style={{width: '20px'}} /> 
                          <span style={{color: activeTab === 'prices' ? '#ffffff' : '#d1d5db'}}>Price Settings</span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="settings-nav-item mb-2">
                        <Nav.Link 
                          eventKey="server" 
                          style={{
                            padding: '1rem 1.25rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            borderRadius: '8px',
                            opacity: '0.6',
                          }}
                          disabled
                        >
                          <FontAwesomeIcon icon={faServer} className="me-3" style={{width: '20px'}} /> 
                          <span style={{color: '#94a3b8'}}>Server Configuration</span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="settings-nav-item mb-2">
                        <Nav.Link 
                          eventKey="notifications" 
                          style={{
                            padding: '1rem 1.25rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            borderRadius: '8px',
                            opacity: '0.6',
                          }}
                          disabled
                        >
                          <FontAwesomeIcon icon={faBell} className="me-3" style={{width: '20px'}} /> 
                          <span style={{color: '#94a3b8'}}>Notification Settings</span>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col md={9} style={{borderLeft: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <div className="p-3 p-md-4">
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
                          <div className="p-4 text-center">
                            <div className="py-5" style={{color: '#94a3b8'}}>
                              <FontAwesomeIcon icon={faServer} style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.7}} />
                              <h5 style={{color: '#d1d5db'}}>Server Configuration</h5>
                              <p style={{color: '#94a3b8'}}>Server configuration settings will be available in a future update.</p>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="notifications">
                          <div className="p-4 text-center">
                            <div className="py-5" style={{color: '#94a3b8'}}>
                              <FontAwesomeIcon icon={faBell} style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.7}} />
                              <h5 style={{color: '#d1d5db'}}>Notification Settings</h5>
                              <p style={{color: '#94a3b8'}}>Notification settings will be available in a future update.</p>
                            </div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
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