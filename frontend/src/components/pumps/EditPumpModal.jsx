import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

const EditPumpModal = ({ show, handleClose, handleEdit, pump }) => {
  const [validated, setValidated] = useState(false);
  const [pumpData, setPumpData] = useState({
    _id: '',
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
    timeInstalled: '',
    status: 'active',
    address: {
      barangay: '',
      municipality: '',
      region: '',
      country: 'Philippines'
    }
  });

  // Set initial pump data when modal opens or pump changes
  useEffect(() => {
    if (pump) {
      const formattedTimeInstalled = new Date(pump.timeInstalled).toISOString().split('T')[0];
      setPumpData({
        ...pump,
        timeInstalled: formattedTimeInstalled
      });
    }
  }, [pump]);

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
    
    handleEdit(formattedData);
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Edit Solar Pump #{pumpData.solarPumpNumber}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="px-4">
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="solarPumpNumber">
                <Form.Label>Pump Number*</Form.Label>
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
                <Form.Label>Model*</Form.Label>
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
                <Form.Label>Power*</Form.Label>
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
                <Form.Label>AC Input Voltage*</Form.Label>
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
                <Form.Label>PV Operating Voltage*</Form.Label>
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
                <Form.Label>Open Circuit Voltage*</Form.Label>
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
                <Form.Label>Outlet*</Form.Label>
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
                <Form.Label>Max Head*</Form.Label>
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
                <Form.Label>Max Flow*</Form.Label>
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
                <Form.Label>Solar Panel Config*</Form.Label>
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
                  <option value="warning">Warning</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="timeInstalled">
                <Form.Label>Installation Date*</Form.Label>
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
          
          <h6 className="mt-4 mb-3">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2 text-primary" />
            Location
          </h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="lat">
                <Form.Label>Latitude*</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="any"
                  name="lat"
                  value={pumpData.lat}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Latitude is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lng">
                <Form.Label>Longitude*</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="any"
                  name="lng"
                  value={pumpData.lng}
                  onChange={handleChange}
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
                <Form.Label>Barangay</Form.Label>
                <Form.Control
                  type="text"
                  name="address.barangay"
                  value={pumpData.address.barangay}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Will be auto-filled from coordinates if left empty.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address.municipality">
                <Form.Label>Municipality</Form.Label>
                <Form.Control
                  type="text"
                  name="address.municipality"
                  value={pumpData.address.municipality}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Will be auto-filled from coordinates if left empty.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="address.region">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  name="address.region"
                  value={pumpData.address.region}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Will be auto-filled from coordinates if left empty.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address.country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="address.country"
                  value={pumpData.address.country}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Default: Philippines
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={pumpData.image || ''}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Update Pump
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPumpModal;