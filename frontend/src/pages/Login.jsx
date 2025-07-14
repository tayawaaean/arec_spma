import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt, faSun } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import '../styles/login.css';

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: name === 'remember' ? checked : value
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Clear general login error when user changes any input
    if (loginError) {
      setLoginError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API to log in
      const response = await authService.login(
        credentials.username, 
        credentials.password
      );
      
      // Get the token and user info from the response
      const { token, user } = response;
      
      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // If remember me is checked, set longer expiry (optional)
      if (credentials.remember) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
      }
      
      // Update authentication state in parent component
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      
      // Trigger auth change event for other components
      window.dispatchEvent(new Event('authChange'));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific API errors
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError('Invalid username or password');
        } else if (error.response.data?.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError('Authentication failed. Please try again.');
        }
      } else if (error.request) {
        setLoginError('Cannot connect to the server. Please check your internet connection.');
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-solar-shape"></div>
        <div className="login-solar-shape shape-2"></div>
        <div className="login-solar-shape shape-3"></div>
        <div className="login-solar-rays"></div>
      </div>
      
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xl={5}>
            <div className="login-card-container">
              <Card className="login-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div className="logo-container mb-4">
                      <div className="logo-icon">
                        <FontAwesomeIcon icon={faSun} className="sun-icon" />
                        <span className="solar-dot dot-1"></span>
                        <span className="solar-dot dot-2"></span>
                        <span className="solar-dot dot-3"></span>
                      </div>
                    </div>
                    <h2 className="login-title">Solar Admin</h2>
                    <p className="login-subtitle">Pump Monitoring System</p>
                  </div>
                  
                  {loginError && (
                    <div className="login-error mb-4">
                      {loginError}
                    </div>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="login-input-group mb-4">
                      <div className="login-input-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className={`login-input ${errors.username ? 'is-invalid' : ''}`}
                      />
                      {errors.username && (
                        <div className="invalid-feedback">{errors.username}</div>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="login-input-group mb-4">
                      <div className="login-input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </div>
                      <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={`login-input ${errors.password ? 'is-invalid' : ''}`}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </Form.Group>
                    
                    <Row className="mb-4">
                      <Col>
                        <Form.Check
                          type="checkbox"
                          name="remember"
                          id="remember-me"
                          label="Remember me"
                          checked={credentials.remember}
                          onChange={handleChange}
                          className="login-checkbox"
                        />
                      </Col>
                      <Col className="text-end">
                        <a href="#forgot-password" className="login-forgot-link">
                          Forgot password?
                        </a>
                      </Col>
                    </Row>
                    
                    <Button 
                      variant="primary"
                      type="submit"
                      className="login-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : (
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      )}
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              
              <div className="login-card-footer text-center mt-3">
                <p className="mb-0 text-muted">
                  &copy; 2025 AREC Solar Pump Monitoring System
                </p>
                <p className="text-muted mt-1">
                  <small>{new Date().toISOString().slice(0, 19).replace('T', ' ')}</small>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;