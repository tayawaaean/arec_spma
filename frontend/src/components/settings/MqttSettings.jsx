import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, faUndo, faCheck, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import PasswordVerificationModal from './PasswordVerificationModal';
import ConfirmationModal from './ConfirmationModal';
import { getMqttSettings, updateMqttSettings, resetToDefaultMqttSettings } from '../../utils/mqttSettingsSimulator';

const MqttSettings = ({ showNotification }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brokerUrl: '',
    username: '',
    password: '',
  });
  const [originalBrokerUrl, setOriginalBrokerUrl] = useState('');
  const [isUsingDefaults, setIsUsingDefaults] = useState(true);
  const [errors, setErrors] = useState({});
  
  // Modals control
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'save' or 'reset'

  // Fetch current MQTT settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await getMqttSettings();
      setFormData({
        brokerUrl: settings.brokerUrl,
        username: '',  // Don't populate password fields from server
        password: '',  // Don't populate password fields from server
      });
      setOriginalBrokerUrl(settings.brokerUrl);
      setIsUsingDefaults(settings.isDefault);
      setErrors({});
    } catch (error) {
      console.error('Error fetching MQTT settings:', error);
      showNotification('danger', 'Failed to load MQTT settings.');
    } finally {
      setLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.brokerUrl.trim()) {
      newErrors.brokerUrl = 'Broker URL is required';
    } else if (!formData.brokerUrl.match(/^(mqtt|mqtts|ws|wss):\/\/.+/)) {
      newErrors.brokerUrl = 'Invalid broker URL format (must start with mqtt://, mqtts://, ws://, or wss://)';
    }
    
    // Only validate username/password if they are provided or if this is a new configuration
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  // Handle save button click
  const handleSave = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setActionType('save');
    setShowPasswordModal(true);
  };

  // Handle reset to default button click
  const handleResetClick = () => {
    setActionType('reset');
    setShowResetConfirmModal(true);
  };

  // Handle password verification success
  const handlePasswordVerified = async (password) => {
    setShowPasswordModal(false);
    
    if (actionType === 'save') {
      await saveSettings(password);
    } else if (actionType === 'reset') {
      setShowResetConfirmModal(false);
      await resetSettings(password);
    }
  };

  // Save settings
  const saveSettings = async (adminPassword) => {
    setSaving(true);
    try {
      const result = await updateMqttSettings(
        formData.brokerUrl,
        formData.username,
        formData.password,
        adminPassword
      );
      
      showNotification('success', 'MQTT connection settings updated successfully!');
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Error saving MQTT settings:', error);
      showNotification('danger', error.message || 'Failed to update MQTT settings.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default settings
  const resetSettings = async (adminPassword) => {
    setSaving(true);
    try {
      const result = await resetToDefaultMqttSettings(adminPassword);
      
      showNotification('success', 'MQTT settings have been reset to default values.');
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Error resetting MQTT settings:', error);
      showNotification('danger', error.message || 'Failed to reset MQTT settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h5 className="mb-4">MQTT Connection Configuration</h5>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading MQTT configuration...</p>
        </div>
      ) : (
        <>
          <Card 
            className="mb-4"
            style={{ 
              backgroundColor: isUsingDefaults ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderColor: isUsingDefaults ? 'var(--blue-accent)' : 'var(--icon-co2)'
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon 
                  icon={isUsingDefaults ? faExclamationTriangle : faCheck} 
                  className={`me-3 ${isUsingDefaults ? 'text-warning' : 'text-success'}`}
                  size="lg"
                />
                <div>
                  <h6 className="mb-1 text-muted">
                    {isUsingDefaults 
                      ? 'Using Default Configuration' 
                      : 'Using Custom Configuration'}
                  </h6>
                  <p className="mb-0 text-muted">
                    {isUsingDefaults 
                      ? 'MQTT is currently using the default credentials from environment variables.' 
                      : 'MQTT is using custom credentials set by an administrator.'}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>Broker URL</Form.Label>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="brokerUrl"
                  value={formData.brokerUrl}
                  onChange={handleChange}
                  isInvalid={!!errors.brokerUrl}
                  placeholder="mqtt://example.com:1883"
                  style={{ 
                    background: 'var(--filter-bg)', 
                    color: 'var(--text-primary)', 
                    borderColor: errors.brokerUrl ? 'var(--danger)' : 'var(--filter-border)'
                  }}
                />
                {errors.brokerUrl && (
                  <Form.Text className="text-danger">{errors.brokerUrl}</Form.Text>
                )}
                <Form.Text className="text-muted">
                  Format: mqtt://hostname:port or mqtts://hostname:port
                </Form.Text>
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>Username</Form.Label>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  placeholder="MQTT username"
                  style={{ 
                    background: 'var(--filter-bg)', 
                    color: 'var(--text-primary)', 
                    borderColor: errors.username ? 'var(--danger)' : 'var(--filter-border)'
                  }}
                />
                {errors.username && (
                  <Form.Text className="text-danger">{errors.username}</Form.Text>
                )}
                <Form.Text className="text-muted">
                  {isUsingDefaults 
                    ? 'Leave blank to keep using the default username.' 
                    : 'Leave blank to keep the existing username.'}
                </Form.Text>
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>Password</Form.Label>
              <Col md={9}>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="MQTT password"
                  style={{ 
                    background: 'var(--filter-bg)', 
                    color: 'var(--text-primary)', 
                    borderColor: errors.password ? 'var(--danger)' : 'var(--filter-border)'
                  }}
                />
                {errors.password && (
                  <Form.Text className="text-danger">{errors.password}</Form.Text>
                )}
                <Form.Text className="text-muted">
                  {isUsingDefaults 
                    ? 'Leave blank to keep using the default password.' 
                    : 'Leave blank to keep the existing password.'}
                </Form.Text>
              </Col>
            </Form.Group>
            
            <Row className="mt-4">
              <Col>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={handleResetClick}
                    disabled={saving || isUsingDefaults}
                    style={{ 
                      background: 'var(--filter-bg)', 
                      color: 'var(--text-primary)', 
                      borderColor: 'var(--filter-border)'
                    }}
                  >
                    <FontAwesomeIcon icon={faUndo} className="me-2" />
                    Reset to Default
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ 
                      background: 'var(--blue-accent)', 
                      borderColor: 'var(--blue-accent)'
                    }}
                  >
                    {saving ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </>
      )}
      
      {/* Password verification modal */}
      <PasswordVerificationModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        onPasswordVerified={handlePasswordVerified}
        actionType={actionType}
      />
      
      {/* Reset confirmation modal */}
      <ConfirmationModal
        show={showResetConfirmModal}
        onHide={() => setShowResetConfirmModal(false)}
        onConfirm={() => setShowPasswordModal(true)}
        title="Reset MQTT Settings"
        message="Are you sure you want to reset MQTT settings to default values? This will disconnect all current MQTT connections and reconnect using environment variables."
        confirmButtonText="Reset to Default"
        confirmButtonVariant="warning"
      />
    </div>
  );
};

export default MqttSettings;