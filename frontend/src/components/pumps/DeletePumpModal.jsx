import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, faTimes, faExclamationTriangle, 
  faInfoCircle, faUser, faClock
} from '@fortawesome/free-solid-svg-icons';
import { pumpService } from '../../services/pumpService';
import { toast } from 'react-toastify';

const DeletePumpModal = ({ show, handleClose, onDeleteSuccess, pump }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (!pump) return null;
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to delete the pump
      await pumpService.deletePump(pump._id);
      
      // Show success notification
      toast.success(`Pump #${pump.solarPumpNumber} has been deleted successfully`);
      
      // Close modal and notify parent component
      handleClose();
      if (onDeleteSuccess) onDeleteSuccess();
      
    } catch (err) {
      console.error('Error deleting pump:', err);
      setError(err.response?.data?.message || 'Failed to delete pump. Please try again.');
      toast.error('Failed to delete pump');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="dark-modal"
      dialogClassName="modal-dialog-dark"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title className="text-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Delete Pump
        </Modal.Title>
        <Button 
          variant="link" 
          className="ms-auto p-0 border-0 btn-close-custom" 
          onClick={handleClose}
          disabled={loading}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {error}
          </Alert>
        )}
        
        <p>Are you sure you want to delete the following pump?</p>
        
        <div className="alert alert-warning">
          <div className="mb-2">
            <strong>Pump #{pump.solarPumpNumber}</strong> - {pump.model}
          </div>
          <div>
            Location: {pump.address.municipality}, {pump.address.region}
          </div>
          <div className="mt-2 small">
            <div>
              <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
              Created by: {pump.createdBy}
            </div>
            <div>
              <FontAwesomeIcon icon={faClock} className="me-1 text-muted" />
              Created on: {new Date(pump.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="d-flex align-items-start mb-3">
          <FontAwesomeIcon icon={faInfoCircle} className="text-info mt-1 me-2" />
          <div>
            <p className="mb-1">This action will:</p>
            <ul className="ps-3 mb-0">
              <li>Delete all pump specifications</li>
              <li>Remove the pump from the map and dashboard</li>
              <li>Delete all performance data associated with this pump</li>
            </ul>
          </div>
        </div>
        
        <p className="text-danger mb-0 fw-bold">
          This action cannot be undone.
        </p>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="text-muted me-auto small">
          <FontAwesomeIcon icon={faUser} className="me-1" />
          Dextiee | 
          <FontAwesomeIcon icon={faClock} className="ms-2 me-1" />
          2025-07-09 04:36:48
        </div>
        
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Deleting...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faTrash} className="me-1" />
              Delete Pump
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePumpModal;