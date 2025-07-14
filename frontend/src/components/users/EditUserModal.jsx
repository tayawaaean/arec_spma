import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { userService } from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, faUserEdit, faUser, faShield, faLock
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/modal.css';

const EditUserModal = ({ show, onHide, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    userType: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [userTypes, setUserTypes] = useState(['user', 'admin', 'superadmin']);
  
  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        userType: user.userType
      });
    }
  }, [user]);
  
  useEffect(() => {
    // Fetch user types if needed
    setUserTypes(userService.getUserTypes());
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.userType) {
      newErrors.userType = 'User type is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error('No user selected for editing');
      }
      
      // Call actual API endpoint
      await userService.updateUser(user._id, formData);
      
      onUserUpdated();
      onHide();
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 409) {
          setSubmitError('Username already exists. Please try a different username.');
        } else {
          setSubmitError(error.response.data?.message || 'Error updating user. Please try again.');
        }
      } else {
        setSubmitError('Error connecting to server. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setErrors({});
    setSubmitError('');
    onHide();
  };

  if (!user) return null;

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      backdrop="static"
      keyboard={false}
      centered
      className="custom-modal"
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faUserEdit} className="me-2 text-primary" />
          Edit User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
              Username
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
              placeholder="Enter username"
            />
            {errors.username && (
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faShield} className="me-2 text-primary" />
              User Type
            </Form.Label>
            <Form.Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              isInvalid={!!errors.userType}
            >
              {userTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
            {errors.userType && (
              <Form.Text className="text-danger">{errors.userType}</Form.Text>
            )}
          </Form.Group>
          
          <div className="info-box mb-3">
            <FontAwesomeIcon icon={faLock} className="me-2 text-warning" />
            <span className="text-muted">
              Note: To change a user's password, please use the "Reset Password" function.
            </span>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2 spin-icon" />
              Updating...
            </>
          ) : 'Update User'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;