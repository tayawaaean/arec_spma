import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, InputGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave, faUndo, faGasPump, faTruck, faLightbulb, faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

const getToken = () => localStorage.getItem('token');
const API_URL = 'http://localhost:5000/api';

const fetchPhFuelPrice = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/fuelprice/philippines`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch PH fuel price');
  return res.json();
};

const fetchUserFuelPrice = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/user-fuel-price/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch your fuel price');
  return res.json();
};

const updateUserFuelPrice = async (data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/user-fuel-price/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update your fuel price');
  return res.json();
};

const resetUserFuelPrice = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/user-fuel-price/me/reset`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to reset your fuel price');
  return res.json();
};

const fetchElectricityPrice = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/electricity-price/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch your electricity price');
  return res.json();
};

const updateElectricityPrice = async (pricePerKwh) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/electricity-price/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ pricePerKwh })
  });
  if (!res.ok) throw new Error('Failed to update your electricity price');
  return res.json();
};

const PricesSettings = ({ showNotification }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phPrices, setPhPrices] = useState(null);
  const [phPricesError, setPhPricesError] = useState(false);
  const [userFuelPrice, setUserFuelPrice] = useState({ gasolinePrice: '', dieselPrice: '' });
  const [userElectricityPrice, setUserElectricityPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setPhPricesError(false);
      try {
        let ph = null;
        let userFuel = null;
        let userElec = null;

        // Always fetch user prices first so we can fallback if needed
        try {
          userFuel = await fetchUserFuelPrice();
        } catch (e) {
          showNotification && showNotification('danger', e.message || 'Failed to load your fuel price.');
          setLoading(false);
          return;
        }

        try {
          ph = await fetchPhFuelPrice();
        } catch (e) {
          setPhPricesError(true);
          // fallback: set pseudo-ph-prices as those in userFuelPrice (DB)
          ph = {
            gasoline: { php: userFuel.gasolinePrice, usd: null },
            diesel: { php: userFuel.dieselPrice, usd: null },
            exchange_rate: null
          };
        }

        try {
          userElec = await fetchElectricityPrice();
        } catch (e) {
          showNotification && showNotification('danger', e.message || 'Failed to load your electricity price.');
          setLoading(false);
          return;
        }

        setPhPrices(ph);
        setUserFuelPrice({
          gasolinePrice: userFuel.gasolinePrice,
          dieselPrice: userFuel.dieselPrice
        });
        setUserElectricityPrice(userElec.pricePerKwh);
        setErrors({});
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'electricityPrice') {
      setUserElectricityPrice(value);
      setErrors((err) => ({ ...err, electricityPrice: '' }));
    } else {
      setUserFuelPrice((prev) => ({ ...prev, [name]: value }));
      setErrors((err) => ({ ...err, [name]: '' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (+userFuelPrice.gasolinePrice <= 0) errs.gasolinePrice = 'Must be > 0';
    if (+userFuelPrice.dieselPrice <= 0) errs.dieselPrice = 'Must be > 0';
    if (+userElectricityPrice <= 0) errs.electricityPrice = 'Must be > 0';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await Promise.all([
        updateUserFuelPrice({
          gasolinePrice: +userFuelPrice.gasolinePrice,
          dieselPrice: +userFuelPrice.dieselPrice
        }),
        updateElectricityPrice(+userElectricityPrice)
      ]);
      showNotification && showNotification('success', 'Your price settings have been saved!');
    } catch (error) {
      showNotification && showNotification('danger', error.message || 'Failed to update price settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetFuelPrice = async () => {
    setResetting(true);
    try {
      const res = await resetUserFuelPrice();
      setUserFuelPrice({ gasolinePrice: res.gasolinePrice, dieselPrice: res.dieselPrice });
      showNotification && showNotification('info', 'Fuel prices reset to latest Philippine market value.');
    } catch (error) {
      showNotification && showNotification('danger', error.message || 'Failed to reset fuel price.');
    } finally {
      setResetting(false);
    }
  };

  // Utility: format price to 2 decimals or empty string if null/undefined
  const fmt2 = v => v === null || v === undefined ? '' : (+v).toFixed(2);

  return (
    <div className="settings-container">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-light">Loading price settings...</p>
        </div>
      ) : (
        <>
          <h5 className="settings-section-title mb-4">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-primary" />
            Price Settings Configuration
          </h5>
          <div className="important-section mb-4">
            <p className="mb-0 settings-help-text" style={{ fontSize: '0.95rem', color: '#d1d5db' }}>
              Configure or override prices used for calculating cost savings. Default Philippine market prices are shown for reference.
              Your custom prices will be used in all cost calculations.
            </p>
          </div>
          {phPricesError && (
            <Alert variant="warning">
              Could not fetch the latest Philippine market fuel prices.
              Showing your current saved prices from the database.
            </Alert>
          )}
          <Form onSubmit={handleSave}>
            <div className="settings-card mb-4">
              {/* Gasoline */}
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faGasPump} className="settings-field-icon" />
                  Gasoline Price
                  <span className="required-indicator">*</span>
                </Form.Label>
                <Col md={9}>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="gasolinePrice"
                      value={userFuelPrice.gasolinePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      isInvalid={!!errors.gasolinePrice}
                      placeholder="Your gasoline price"
                      className="settings-form-control"
                    />
                    <InputGroup.Text>
                      <strong>PHP/L</strong>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="settings-help-text">
                    Default PH price:&nbsp;
                    <b>
                      {phPrices?.gasoline?.php !== null && phPrices?.gasoline?.php !== undefined
                        ? `${fmt2(phPrices.gasoline.php)} PHP/L`
                        : '...'}
                    </b>
                  </Form.Text>
                  {errors.gasolinePrice && (
                    <Form.Text className="text-danger">{errors.gasolinePrice}</Form.Text>
                  )}
                </Col>
              </Form.Group>
              {/* Diesel */}
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faTruck} className="settings-field-icon" />
                  Diesel Price
                  <span className="required-indicator">*</span>
                </Form.Label>
                <Col md={9}>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="dieselPrice"
                      value={userFuelPrice.dieselPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      isInvalid={!!errors.dieselPrice}
                      placeholder="Your diesel price"
                      className="settings-form-control"
                    />
                    <InputGroup.Text>
                      <strong>PHP/L</strong>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="settings-help-text">
                    Default PH price:&nbsp;
                    <b>
                      {phPrices?.diesel?.php !== null && phPrices?.diesel?.php !== undefined
                        ? `${fmt2(phPrices.diesel.php)} PHP/L`
                        : '...'}
                    </b>
                  </Form.Text>
                  {errors.dieselPrice && (
                    <Form.Text className="text-danger">{errors.dieselPrice}</Form.Text>
                  )}
                </Col>
              </Form.Group>
              <Row>
                <Col md={{ span: 9, offset: 3 }}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleResetFuelPrice}
                    disabled={resetting}
                  >
                    <FontAwesomeIcon icon={faUndo} className="me-2" />
                    {resetting ? 'Resetting...' : 'Reset Fuel Price to PH Market'}
                  </Button>
                </Col>
              </Row>
              {/* Electricity */}
              <Form.Group as={Row} className="mb-4 align-items-center mt-4">
                <Form.Label column md={3} className="settings-field-name">
                  <FontAwesomeIcon icon={faLightbulb} className="settings-field-icon" />
                  Electricity Price
                  <span className="required-indicator">*</span>
                </Form.Label>
                <Col md={9}>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="electricityPrice"
                      value={userElectricityPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      isInvalid={!!errors.electricityPrice}
                      placeholder="Your electricity price"
                      className="settings-form-control"
                    />
                    <InputGroup.Text>
                      <strong>PHP/kWh</strong>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="settings-help-text">
                    No national default, enter your actual electricity rate per kWh.
                  </Form.Text>
                  {errors.electricityPrice && (
                    <Form.Text className="text-danger">{errors.electricityPrice}</Form.Text>
                  )}
                </Col>
              </Form.Group>
            </div>
            <Row className="mt-4">
              <Col>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
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