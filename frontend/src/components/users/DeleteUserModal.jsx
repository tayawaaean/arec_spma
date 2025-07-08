import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteUser } from '../../utils/userDataSimulator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeleteUserModal = ({ show, onHide, user, onUserDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  
  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      if (!user) {
        throw new Error('No user selected for deletion');
      }
      
      // Simulate API call with local function
      const deletedUser = deleteUser(user.id);
      
      if (deletedUser) {
        onUserDeleted();
        onHide();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (!user) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
        <Modal.Title style={{ color: 'var(--text-primary)' }}>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-4">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            size="3x" 
            className="text-warning mb-3"
          />
          <h5>Are you sure you want to delete this user?</h5>
          <p className="text-muted">
            You are about to delete the user <strong>{user.username}</strong> with role <strong>{user.userType}</strong>.
            This action cannot be undone.
          </p>
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
          variant="danger" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete User'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;