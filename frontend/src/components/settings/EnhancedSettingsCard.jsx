import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EnhancedSettingsCard = ({ title, icon, children, showStatus, statusType, statusText }) => {
  return (
    <Card className="enhanced-settings-card mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {icon && <FontAwesomeIcon icon={icon} className="settings-card-icon me-3" />}
            <h5 className="mb-0">{title}</h5>
          </div>
          {showStatus && (
            <div className={`status-badge status-${statusType}`}>
              {statusText}
            </div>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
};

export default EnhancedSettingsCard;