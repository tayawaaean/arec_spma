import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const SlidingPanel = ({ leftComponent, rightComponent, leftTitle, rightTitle, leftIcon, rightIcon }) => {
  const [activePanel, setActivePanel] = useState('left');

  return (
    <div className="dashboard-card sliding-panel-container h-100">
      <Nav className="sliding-panel-nav" variant="pills">
        <Nav.Item>
          <Nav.Link 
            active={activePanel === 'left'} 
            onClick={() => setActivePanel('left')}
            className="d-flex align-items-center justify-content-center"
          >
            {leftIcon && <FontAwesomeIcon icon={leftIcon} className={rightTitle ? "me-2" : ""} />}
            {leftTitle}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activePanel === 'right'} 
            onClick={() => setActivePanel('right')}
            className="d-flex align-items-center justify-content-center"
          >
            {rightIcon && <FontAwesomeIcon icon={rightIcon} className={rightTitle ? "me-2" : ""} />}
            {rightTitle}
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      <div className="sliding-panel-content">
        <div 
          className="sliding-panels"
          style={{ 
            transform: activePanel === 'left' ? 'translateX(0)' : 'translateX(-50%)'
          }}
        >
          <div className="panel left-panel">
            {leftComponent}
          </div>
          <div className="panel right-panel">
            {rightComponent}
          </div>
        </div>
      </div>
      
      {/* Move buttons to top-right corner for less intrusion */}
      <div className="panel-nav-buttons">
        {activePanel === 'right' && (
          <button 
            className="panel-nav-button panel-nav-prev"
            onClick={() => setActivePanel('left')}
            aria-label="Previous panel"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        {activePanel === 'left' && (
          <button 
            className="panel-nav-button panel-nav-next"
            onClick={() => setActivePanel('right')}
            aria-label="Next panel"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SlidingPanel;