import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { userService } from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSpinner, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/modal.css';

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
      
      // Call actual API endpoint
      await userService.deleteUser(user._id);
      
      onUserDeleted();
      onHide();
    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Error deleting user. Please try again.');
      } else {
        setError('Error connecting to server. Please try again later.');
      }
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
      className="custom-modal"
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faUserSlash} className="me-2 text-danger" />
          Delete User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="text-center mb-4">
          <div className="delete-warning-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h5 className="fw-bold mb-3">Are you sure you want to delete this user?</h5>
          <p className="mb-1">
            You are about to delete the user <span className="fw-bold text-light">{user.username}</span> with role <span className="fw-bold text-light">{user.userType}</span>.
          </p>
          <p className="text-danger fw-semibold">
            This action cannot be undone.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2 spin-icon" />
              Deleting...
            </>
          ) : 'Delete User'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;