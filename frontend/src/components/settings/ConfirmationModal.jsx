import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmButtonText,
  confirmButtonVariant = 'danger'
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
      className="settings-modal"
    >
      <Modal.Header className="settings-modal-header">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="settings-modal-body">
        <div className="text-center mb-4">
          <div className="modal-icon-container">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              size="3x" 
              className="text-warning modal-icon"
            />
          </div>
          <p className="mt-3">{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="settings-modal-footer">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="settings-btn settings-btn-secondary"
        >
          Cancel
        </Button>
        <Button 
          variant={confirmButtonVariant} 
          onClick={onConfirm}
          className="settings-btn"
        >
          {confirmButtonText || 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;