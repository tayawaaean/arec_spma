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
    >
      <Modal.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
        <Modal.Title style={{ color: 'var(--text-primary)' }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        <div className="text-center mb-4">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            size="3x" 
            className="text-warning mb-3"
          />
          <p>{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          style={{ 
            background: 'var(--filter-bg)', 
            color: 'var(--text-primary)', 
            borderColor: 'var(--filter-border)'
          }}
        >
          Cancel
        </Button>
        <Button 
          variant={confirmButtonVariant} 
          onClick={onConfirm}
        >
          {confirmButtonText || 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;