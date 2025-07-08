import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faSun, faBell, 
  faExpand, faChartBar
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className="header">
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="text-muted me-2" />
        <input type="text" placeholder="Search" />
      </div>
      
      <div className="header-icons d-flex align-items-center">
        <div className="icon-item mx-3">
          <FontAwesomeIcon icon={faSun} />
        </div>
        <div className="icon-item mx-3">
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className="icon-item mx-3">
          <span className="flag-icon">🇺🇸</span>
        </div>
        <div className="icon-item mx-3">
          <FontAwesomeIcon icon={faExpand} />
        </div>
        <div className="icon-item mx-3">
          <FontAwesomeIcon icon={faChartBar} />
        </div>
        <div className="user-avatar ms-3">
          <img 
            src="https://i.pravatar.cc/40" 
            alt="User" 
            className="rounded-circle"
            width="36"
            height="36"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;