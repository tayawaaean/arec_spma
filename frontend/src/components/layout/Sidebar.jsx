import React, { useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faMapMarkedAlt, 
  faChartLine, 
  faUsers, 
  faSignOutAlt,
  faCog, 
  faPumpSoap, 
  faInfoCircle, 
  faSun,
  faBars,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../App';
import logo from '../../assets/logo.png'; // Adjust path as needed

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed ? (
            <>
              <img src={logo} alt="Solar Admin" className="logo" />
              <span className="logo-text">Solar Admin</span>
            </>
          ) : (
            <FontAwesomeIcon icon={faSun} className="collapsed-logo" />
          )}
        </div>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
        </button>
      </div>
      
      <div className="sidebar-user-info">
        <div className="user-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'G'}
        </div>
        {!collapsed && (
          <div className="user-details">
            <div className="user-name">{user?.username || 'Guest'}</div>
            <div className="user-role">{user?.userType || 'Visitor'}</div>
          </div>
        )}
      </div>
      
      {/* Date and time section removed */}
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-menu">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/map" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faMapMarkedAlt} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Pump Map</span>}
        </NavLink>
        
        <NavLink 
          to="/pumps" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faPumpSoap} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Pumps</span>}
        </NavLink>
        
        <NavLink 
          to="/datas" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faChartLine} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Data Analysis</span>}
        </NavLink>
        
        {/* Show Users menu item only for admin and superadmin */}
        {user && ['admin', 'superadmin'].includes(user.userType) && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
            {!collapsed && <span className="sidebar-text">Users</span>}
          </NavLink>
        )}
        
        {/* Show Settings menu item only for superadmin */}
        {user && user.userType === 'superadmin' && (
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
            {!collapsed && <span className="sidebar-text">Settings</span>}
          </NavLink>
        )}
        
        <NavLink 
          to="/about" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">About</span>}
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `sidebar-item ${isActive ? 'active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Profile</span>}
        </NavLink>
        
        <NavLink 
          to="/logout" 
          className="sidebar-item logout-item"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-text">Logout</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;