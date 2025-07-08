import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, faGasPump, faTruck, faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import { getPriceSettings, updatePriceSettings } from '../../utils/priceSettingsSimulator';

const PricesSettings = ({ showNotification }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gasolinePrice: 0,
    dieselPrice: 0,
    electricityPrice: 0
  });
  const [errors, setErrors] = useState({});

  // Fetch current price settings
  const fetchPriceSettings = async () => {
    setLoading(true);
    try {
      const settings = await getPriceSettings();
      setFormData({
        gasolinePrice: settings.gasolinePrice,
        dieselPrice: settings.dieselPrice,
        electricityPrice: settings.electricityPrice
      });
      setErrors({});
    } catch (error) {
      console.error('Error fetching price settings:', error);
      showNotification('danger', 'Failed to load price settings.');
    } finally {
      setLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchPriceSettings();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    const numericValue = parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : isNaN(numericValue) ? prev[name] : numericValue
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
    
    if (formData.gasolinePrice <= 0) {
      newErrors.gasolinePrice = 'Gasoline price must be greater than 0';
    }
    
    if (formData.dieselPrice <= 0) {
      newErrors.dieselPrice = 'Diesel price must be greater than 0';
    }
    
    if (formData.electricityPrice <= 0) {
      newErrors.electricityPrice = 'Electricity price must be greater than 0';
    }
    
    return newErrors;
  };

  // Handle save button click
  const handleSave = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSaving(true);
    try {
      const result = await updatePriceSettings(formData);
      
      showNotification('success', 'Price settings updated successfully!');
    } catch (error) {
      console.error('Error saving price settings:', error);
      showNotification('danger', error.message || 'Failed to update price settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h5 className="mb-4">Price Settings</h5>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading price settings...</p>
        </div>
      ) : (
        <>
          <Card className="mb-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <Card.Body>
            <p className="mb-0 text-muted">
              Configure the prices used for calculating cost savings in the dashboard.
              These prices will be used to estimate how much money is saved by using
              solar pumps instead of traditional fuel-based or electric pumps.
            </p>
            </Card.Body>
          </Card>
          
          <Form>
            <Form.Group as={Row} className="mb-4">
              <Form.Label column md={3}>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '32px', textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faGasPump} />
                  </div>
                  Gasoline Price
                </div>
              </Form.Label>
              <Col md={9}>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="gasolinePrice"
                    value={formData.gasolinePrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.gasolinePrice}
                    placeholder="Enter gasoline price"
                    style={{ 
                      background: 'var(--filter-bg)', 
                      color: 'var(--text-primary)', 
                      borderColor: errors.gasolinePrice ? 'var(--danger)' : 'var(--filter-border)'
                    }}
                  />
                  <InputGroup.Text style={{ background: 'var(--filter-bg)', borderColor: 'var(--filter-border)' }}>
                    PHP/L
                  </InputGroup.Text>
                </InputGroup>
                {errors.gasolinePrice && (
                  <Form.Text className="text-danger">{errors.gasolinePrice}</Form.Text>
                )}
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-4">
              <Form.Label column md={3}>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '32px', textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faTruck} />
                  </div>
                  Diesel Price
                </div>
              </Form.Label>
              <Col md={9}>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="dieselPrice"
                    value={formData.dieselPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.dieselPrice}
                    placeholder="Enter diesel price"
                    style={{ 
                      background: 'var(--filter-bg)', 
                      color: 'var(--text-primary)', 
                      borderColor: errors.dieselPrice ? 'var(--danger)' : 'var(--filter-border)'
                    }}
                  />
                  <InputGroup.Text style={{ background: 'var(--filter-bg)', borderColor: 'var(--filter-border)' }}>
                    PHP/L
                  </InputGroup.Text>
                </InputGroup>
                {errors.dieselPrice && (
                  <Form.Text className="text-danger">{errors.dieselPrice}</Form.Text>
                )}
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-4">
              <Form.Label column md={3}>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '32px', textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  Electricity Price
                </div>
              </Form.Label>
              <Col md={9}>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="electricityPrice"
                    value={formData.electricityPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.electricityPrice}
                    placeholder="Enter electricity price"
                    style={{ 
                      background: 'var(--filter-bg)', 
                      color: 'var(--text-primary)', 
                      borderColor: errors.electricityPrice ? 'var(--danger)' : 'var(--filter-border)'
                    }}
                  />
                  <InputGroup.Text style={{ background: 'var(--filter-bg)', borderColor: 'var(--filter-border)' }}>
                    PHP/kWh
                  </InputGroup.Text>
                </InputGroup>
                {errors.electricityPrice && (
                  <Form.Text className="text-danger">{errors.electricityPrice}</Form.Text>
                )}
              </Col>
            </Form.Group>
            
            <Row className="mt-4">
              <Col>
                <div className="d-flex justify-content-end">
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
                        Save Price Settings
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </div>
  );
};

export default PricesSettings;