import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { updateUser, getUserTypes } from '../../utils/userDataSimulator';

const EditUserModal = ({ show, onHide, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    userType: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const userTypes = getUserTypes();
  
  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        userType: user.userType
      });
    }
  }, [user]);
  
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
      
      // Simulate API call with local function
      const updatedUser = updateUser(user.id, formData);
      
      if (updatedUser) {
        onUserUpdated();
        onHide();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSubmitError('Error updating user. Please try again.');
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
    >
      <Modal.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
        <Modal.Title style={{ color: 'var(--text-primary)' }}>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
              style={{ 
                background: 'var(--filter-bg)', 
                color: 'var(--text-primary)', 
                borderColor: errors.username ? 'var(--danger)' : 'var(--filter-border)'
              }}
            />
            {errors.username && (
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>User Type</Form.Label>
            <Form.Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              isInvalid={!!errors.userType}
              style={{ 
                background: 'var(--filter-bg)', 
                color: 'var(--text-primary)', 
                borderColor: errors.userType ? 'var(--danger)' : 'var(--filter-border)'
              }}
            >
              {userTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
            {errors.userType && (
              <Form.Text className="text-danger">{errors.userType}</Form.Text>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Text className="text-muted">
              Note: To change a user's password, please use the "Reset Password" function.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
        <Button 
          variant="outline-secondary" 
          onClick={handleCancel}
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
          disabled={isSubmitting}
          style={{ 
            background: 'var(--blue-accent)', 
            borderColor: 'var(--blue-accent)'
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update User'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;