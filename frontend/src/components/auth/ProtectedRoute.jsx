import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and authorized, render the element
  return element;
};

export default ProtectedRoute;