import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, faTimes, faMapMarkedAlt, 
  faLocationArrow, faCamera, faTrash, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { pumpService } from '../../services/pumpService';

const AddPumpModal = ({ show, handleClose, handleAdd }) => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [pumpData, setPumpData] = useState({
    solarPumpNumber: '',
    model: '',
    power: '',
    acInputVoltage: '',
    pvOperatingVoltage: '',
    openCircuitVoltage: '',
    outlet: '',
    maxHead: '',
    maxFlow: '',
    solarPanelConfig: '',
    image: '',
    lat: '',
    lng: '',
    timeInstalled: new Date().toISOString().split('T')[0],
    status: 'active',
    address: {
      barangay: '',
      municipality: '',
      region: '',
      country: 'Philippines'
    }
  });

  // Get current location using browser's Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setGettingLocation(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update form data with coordinates
        setPumpData({
          ...pumpData,
          lat: latitude,
          lng: longitude
        });
        
        // Get address from coordinates
        try {
          const addressData = await pumpService.reverseGeocode(latitude, longitude);
          setPumpData(prev => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: {
              ...prev.address,
              ...addressData
            }
          }));
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
        }
        
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Handle manual coordinates change and get address
  const handleCoordinatesChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the coordinate field
    setPumpData({
      ...pumpData,
      [name]: value
    });
    
    // If both lat and lng have values, try to get the address
    const updatedPumpData = {
      ...pumpData,
      [name]: value
    };
    
    if (updatedPumpData.lat && updatedPumpData.lng) {
      try {
        setLoading(true);
        const addressData = await pumpService.reverseGeocode(
          updatedPumpData.lat, 
          updatedPumpData.lng
        );
        
        setPumpData({
          ...updatedPumpData,
          address: {
            ...updatedPumpData.address,
            ...addressData
          }
        });
      } catch (error) {
        console.error('Error getting address from coordinates:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should not exceed 2MB');
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Only image files are allowed');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set image preview
      setImagePreview(event.target.result);
      
      // Store base64 data in form
      setPumpData({
        ...pumpData,
        image: event.target.result
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(null);
    setPumpData({
      ...pumpData,
      image: ''
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested address object
      const [parent, child] = name.split('.');
      setPumpData({
        ...pumpData,
        [parent]: {
          ...pumpData[parent],
          [child]: value
        }
      });
    } else {
      setPumpData({ ...pumpData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Format the data correctly
    const formattedData = {
      ...pumpData,
      solarPumpNumber: parseInt(pumpData.solarPumpNumber),
      lat: parseFloat(pumpData.lat),
      lng: parseFloat(pumpData.lng),
      timeInstalled: new Date(pumpData.timeInstalled).toISOString()
    };
    
    handleAdd(formattedData);
    resetForm();
  };
  
  // Reset form fields
  const resetForm = () => {
    setPumpData({
      solarPumpNumber: '',
      model: '',
      power: '',
      acInputVoltage: '',
      pvOperatingVoltage: '',
      openCircuitVoltage: '',
      outlet: '',
      maxHead: '',
      maxFlow: '',
      solarPanelConfig: '',
      image: '',
      lat: '',
      lng: '',
      timeInstalled: new Date().toISOString().split('T')[0],
      status: 'active',
      address: {
        barangay: '',
        municipality: '',
        region: '',
        country: 'Philippines'
      }
    });
    setValidated(false);
    setImagePreview(null);
  };
  
  // Handle cancel button
  const handleCancel = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleCancel} 
      backdrop="static"
      keyboard={false}
      size="lg"
      className="dark-modal"
      dialogClassName="modal-dialog-dark"
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Add New Solar Pump</Modal.Title>
          <Button variant="link" className="ms-auto p-0 border-0 btn-close-custom" onClick={handleCancel} aria-label="Close">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        
        <Modal.Body className="px-4">
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="solarPumpNumber">
                <Form.Label>Pump Number</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="solarPumpNumber"
                  value={pumpData.solarPumpNumber}
                  onChange={handleChange}
                  min="1"
                />
                <Form.Control.Feedback type="invalid">
                  Pump number is required and must be positive.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="model">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="model"
                  value={pumpData.model}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Model is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="power">
                <Form.Label>Power</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="power"
                  value={pumpData.power}
                  onChange={handleChange}
                  placeholder="e.g. 1.5kW"
                />
                <Form.Control.Feedback type="invalid">
                  Power is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <h6 className="mt-4 mb-3">Electrical Specifications</h6>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="acInputVoltage">
                <Form.Label>AC Input Voltage</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="acInputVoltage"
                  value={pumpData.acInputVoltage}
                  onChange={handleChange}
                  placeholder="e.g. 220V"
                />
                <Form.Control.Feedback type="invalid">
                  AC Input Voltage is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="pvOperatingVoltage">
                <Form.Label>PV Operating Voltage</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="pvOperatingVoltage"
                  value={pumpData.pvOperatingVoltage}
                  onChange={handleChange}
                  placeholder="e.g. 200V"
                />
                <Form.Control.Feedback type="invalid">
                  PV Operating Voltage is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="openCircuitVoltage">
                <Form.Label>Open Circuit Voltage</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="openCircuitVoltage"
                  value={pumpData.openCircuitVoltage}
                  onChange={handleChange}
                  placeholder="e.g. 240V"
                />
                <Form.Control.Feedback type="invalid">
                  Open Circuit Voltage is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <h6 className="mt-4 mb-3">Water Specifications</h6>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="outlet">
                <Form.Label>Outlet</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="outlet"
                  value={pumpData.outlet}
                  onChange={handleChange}
                  placeholder="e.g. 2 inch"
                />
                <Form.Control.Feedback type="invalid">
                  Outlet is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="maxHead">
                <Form.Label>Max Head</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="maxHead"
                  value={pumpData.maxHead}
                  onChange={handleChange}
                  placeholder="e.g. 35m"
                />
                <Form.Control.Feedback type="invalid">
                  Max Head is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="maxFlow">
                <Form.Label>Max Flow</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="maxFlow"
                  value={pumpData.maxFlow}
                  onChange={handleChange}
                  placeholder="e.g. 10m3/h"
                />
                <Form.Control.Feedback type="invalid">
                  Max Flow is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="solarPanelConfig">
                <Form.Label>Solar Panel Config</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="solarPanelConfig"
                  value={pumpData.solarPanelConfig}
                  onChange={handleChange}
                  placeholder="e.g. 6x300W"
                />
                <Form.Control.Feedback type="invalid">
                  Solar Panel Config is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={pumpData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintainance">Maintainance</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="timeInstalled">
                <Form.Label>Installation Date</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="timeInstalled"
                  value={pumpData.timeInstalled}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Installation Date is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          {/* Image Upload Section */}
          <h6 className="mt-4 mb-3">
            <FontAwesomeIcon icon={faCamera} className="me-2 text-info" />
            Pump Image
          </h6>
          <Row className="mb-4">
            <Col md={12}>
              <div className="image-upload-container">
                {!imagePreview ? (
                  <>
                    <Form.Label htmlFor="image-upload" className="image-upload-label">
                      <div className="upload-placeholder">
                        <FontAwesomeIcon icon={faCamera} size="2x" className="mb-2" />
                        <p>Click to upload pump image</p>
                        <small className="text-muted">Maximum size: 2MB. Formats: JPG, PNG</small>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </Form.Label>
                  </>
                ) : (
                  <div className="image-preview-container">
                    <Image 
                      src={imagePreview} 
                      alt="Pump preview" 
                      thumbnail 
                      className="image-preview" 
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={removeImage} 
                      className="remove-image-btn"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span className="ms-1">Remove</span>
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          
          <h6 className="mt-4 mb-3">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2 text-primary" />
            Location
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="ms-2" 
              onClick={getCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                  Getting Location...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLocationArrow} className="me-1" />
                  Get Current Location
                </>
              )}
            </Button>
          </h6>
          
          {locationError && (
            <div className="alert alert-warning mb-3">
              <small>{locationError}</small>
            </div>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="lat">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="any"
                  name="lat"
                  value={pumpData.lat}
                  onChange={handleCoordinatesChange}
                  placeholder="e.g. 14.5995"
                />
                <Form.Control.Feedback type="invalid">
                  Latitude is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lng">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="any"
                  name="lng"
                  value={pumpData.lng}
                  onChange={handleCoordinatesChange}
                  placeholder="e.g. 120.9842"
                />
                <Form.Control.Feedback type="invalid">
                  Longitude is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="address.barangay">
                <Form.Label className="optional">Barangay</Form.Label>
                <Form.Control
                  type="text"
                  name="address.barangay"
                  value={pumpData.address.barangay}
                  onChange={handleChange}
                  placeholder={loading ? "Loading..." : ""}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Auto-filled from coordinates
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address.municipality">
                <Form.Label className="optional">Municipality</Form.Label>
                <Form.Control
                  type="text"
                  name="address.municipality"
                  value={pumpData.address.municipality}
                  onChange={handleChange}
                  placeholder={loading ? "Loading..." : ""}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Auto-filled from coordinates
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="address.region">
                <Form.Label className="optional">Region</Form.Label>
                <Form.Control
                  type="text"
                  name="address.region"
                  value={pumpData.address.region}
                  onChange={handleChange}
                  placeholder={loading ? "Loading..." : ""}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Auto-filled from coordinates
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address.country">
                <Form.Label className="optional">Country</Form.Label>
                <Form.Control
                  type="text"
                  name="address.country"
                  value={pumpData.address.country}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save Pump
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPumpModal;