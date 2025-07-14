import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faKey } from '@fortawesome/free-solid-svg-icons';

const PasswordVerificationModal = ({ show, onHide, onPasswordVerified, actionType }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      setPassword('');
      setError('');
      setIsVerifying(false);
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsVerifying(true);

    // In a real app, you might verify with the server here.
    // In this workflow, we just pass the password up for the parent to use in the API call.
    setTimeout(() => {
      setIsVerifying(false);
      onPasswordVerified(password);
    }, 500);
  };

  const getActionText = () => {
    switch (actionType) {
      case 'save':
        return 'update MQTT settings';
      case 'reset':
        return 'reset to default MQTT settings';
      default:
        return 'perform this action';
    }
  };

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
          <FontAwesomeIcon icon={faUserShield} className="me-2" />
          Administrator Verification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        {error && <Alert variant="danger">{error}</Alert>}

        <p>
          You need superadmin privileges to {getActionText()}. 
          Please enter your password to continue.
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Superadmin Password</Form.Label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'var(--filter-bg)', borderColor: 'var(--filter-border)' }}>
                <FontAwesomeIcon icon={faKey} />
              </span>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                style={{ 
                  background: 'var(--filter-bg)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--filter-border)'
                }}
                autoFocus
              />
            </div>
          </Form.Group>
        </Form>
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
          variant="primary" 
          onClick={handleSubmit}
          disabled={isVerifying}
          style={{ 
            background: 'var(--blue-accent)', 
            borderColor: 'var(--blue-accent)'
          }}
        >
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PasswordVerificationModal;