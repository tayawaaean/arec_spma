import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeletePumpModal = ({ show, handleClose, handleDelete, pump }) => {
  if (!pump) return null;
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="dark-modal"
      dialogClassName="modal-dialog-dark"
    >
      <Modal.Header>
        <Modal.Title className="text-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Delete Pump
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>Are you sure you want to delete the following pump?</p>
        
        <div className="alert alert-warning">
          <div className="mb-2">
            <strong>Pump #{pump.solarPumpNumber}</strong> - {pump.model}
          </div>
          <div>
            Location: {pump.address.municipality}, {pump.address.region}
          </div>
        </div>
        
        <p className="text-danger mb-0">
          <strong>Warning:</strong> This action cannot be undone and will permanently remove all data associated with this pump.
        </p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} className="me-1" />
          Delete Pump
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePumpModal;