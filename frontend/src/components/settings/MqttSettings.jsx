import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faCheck, faExclamationTriangle, faLink, faUser, faKey, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import PasswordVerificationModal from './PasswordVerificationModal';
import ConfirmationModal from './ConfirmationModal';
import { getMqttSettings, updateMqttCredentials, resetToDefaultMqttSettings } from '../../utils/mqttApi';

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

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.brokerUrl.trim()) newErrors.brokerUrl = 'Broker URL is required';
    else if (!formData.brokerUrl.match(/^(mqtt|mqtts|ws|wss):\/\/.+/))
      newErrors.brokerUrl = 'Invalid broker URL format (must start with mqtt://, mqtts://, ws://, or wss://)';
    if (formData.username && formData.username.length < 3)
      newErrors.username = 'Username must be at least 3 characters';
    if (formData.password && formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

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

  const handleResetClick = () => {
    setActionType('reset');
    setShowResetConfirmModal(true);
  };

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
      await updateMqttCredentials({
        brokerUrl: formData.brokerUrl,
        username: formData.username,
        password: formData.password,
        // If your backend expects adminPassword, include it here
        // adminPassword
      });
      showNotification('success', 'MQTT connection settings updated successfully!');
      fetchSettings();
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
      await resetToDefaultMqttSettings();
      showNotification('success', 'MQTT settings have been reset to default values.');
      fetchSettings();
    } catch (error) {
      console.error('Error resetting MQTT settings:', error);
      showNotification('danger', error.message || 'Failed to reset MQTT settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <h5 className="settings-section-title mb-4">
        <FontAwesomeIcon icon={faNetworkWired} className="me-2 text-primary" /> 
        MQTT Connection Configuration
      </h5>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-light">Loading MQTT configuration...</p>
        </div>
      ) : (
        <>
          <Card 
            className="mb-4"
            style={{ 
              backgroundColor: isUsingDefaults ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderColor: isUsingDefaults ? '#3b82f6' : '#10b981',
              borderWidth: '2px',
              borderRadius: '8px'
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
                  <h6 className="mb-1" style={{color: '#ffffff', fontWeight: '600'}}>
                    {isUsingDefaults 
                      ? 'Using Default Configuration' 
                      : 'Using Custom Configuration'}
                  </h6>
                  <p className="mb-0" style={{color: '#d1d5db'}}>
                    {isUsingDefaults 
                      ? 'MQTT is currently using the default credentials from environment variables.' 
                      : 'MQTT is using custom credentials set by an administrator.'}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <div className="settings-card">
            <Form>
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faLink} className="settings-field-icon" />
                  Broker URL
                  <span className="required-indicator">*</span>
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="brokerUrl"
                    value={formData.brokerUrl}
                    onChange={handleChange}
                    isInvalid={!!errors.brokerUrl}
                    placeholder="mqtt://example.com:1883"
                    className="settings-form-control"
                  />
                  {errors.brokerUrl && (
                    <Form.Text className="text-danger fw-bold">{errors.brokerUrl}</Form.Text>
                  )}
                  <Form.Text className="settings-help-text">
                    Format: mqtt://hostname:port or mqtts://hostname:port
                  </Form.Text>
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faUser} className="settings-field-icon" />
                  Username
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="MQTT username"
                    className="settings-form-control"
                  />
                  {errors.username && (
                    <Form.Text className="text-danger fw-bold">{errors.username}</Form.Text>
                  )}
                  <Form.Text className="settings-help-text">
                    {isUsingDefaults 
                      ? 'Leave blank to keep using the default username.' 
                      : 'Leave blank to keep the existing username.'}
                  </Form.Text>
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faKey} className="settings-field-icon" />
                  Password
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="MQTT password"
                    className="settings-form-control"
                  />
                  {errors.password && (
                    <Form.Text className="text-danger fw-bold">{errors.password}</Form.Text>
                  )}
                  <Form.Text className="settings-help-text">
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
                      className="me-3"
                      onClick={handleResetClick}
                      disabled={saving || isUsingDefaults}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontWeight: '500'
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
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                        borderColor: '#2563eb',
                        fontWeight: '500'
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
          </div>
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