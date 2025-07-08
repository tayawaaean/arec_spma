import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faMap, faDatabase, 
  faUsers, faGear, faSignOutAlt,
  faTint, faSolarPanel  // Added new icons for pumps
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="d-flex align-items-center">
          <div className="logo-icon me-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8C17.6569 8 19 6.65685 19 5C19 3.34315 17.6569 2 16 2C14.3431 2 13 3.34315 13 5C13 6.65685 14.3431 8 16 8Z" fill="#FF6B6B" />
              <path d="M24 16C25.6569 16 27 14.6569 27 13C27 11.3431 25.6569 10 24 10C22.3431 10 21 11.3431 21 13C21 14.6569 22.3431 16 24 16Z" fill="#4ECDC4" />
              <path d="M16 30C17.6569 30 19 28.6569 19 27C19 25.3431 17.6569 24 16 24C14.3431 24 13 25.3431 13 27C13 28.6569 14.3431 30 16 30Z" fill="#FFE66D" />
              <path d="M8 16C9.65685 16 11 14.6569 11 13C11 11.3431 9.65685 10 8 10C6.34315 10 5 11.3431 5 13C5 14.6569 6.34315 16 8 16Z" fill="#1A535C" />
              <path d="M8 10C8 10 16 2 24 10" stroke="#7F5AF0" strokeWidth="2" />
              <path d="M24 16C24 16 16 24 8 16" stroke="#7F5AF0" strokeWidth="2" />
              <path d="M8 16C8 16 16 24 16 30" stroke="#7F5AF0" strokeWidth="2" />
              <path d="M24 16C24 16 16 24 16 30" stroke="#7F5AF0" strokeWidth="2" />
            </svg>
          </div>
          <span className="sidebar-logo">Solar Admin</span>
        </div>
      </div>

      <div className="sidebar-menu mt-4">
        <div className="nav-group mb-3">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faHome} className="me-3" /> Dashboard
          </NavLink>
        </div>

        <div className="nav-group mb-3">
          <NavLink 
            to="/map" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faMap} className="me-3" /> Map
          </NavLink>
        </div>
        
        {/* New Pump Management Link */}
        <div className="nav-group mb-3">
          <NavLink 
            to="/pumps" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faSolarPanel} className="me-3" /> Pumps
          </NavLink>
        </div>

        <div className="nav-group mb-3">
          <NavLink 
            to="/datas" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faDatabase} className="me-3" /> Datas
          </NavLink>
        </div>

        <div className="nav-group mb-3">
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faUsers} className="me-3" /> Users
          </NavLink>
        </div>

        <div className="nav-group mb-3">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <FontAwesomeIcon icon={faGear} className="me-3" /> Settings
          </NavLink>
        </div>

        <div className="nav-group mt-auto">
          <NavLink 
            to="/logout" 
            className="nav-item"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-3" /> Logout
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;