import React from 'react';
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const MapHeader = ({ currentUser, currentDateTime }) => {
  return (
    <Row className="mb-3">
      <Col>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">Philippines Solar Pumps</h4>
            <p className="text-muted mb-0">Monitor and manage solar water pumps across the Philippine archipelago</p>
          </div>
          <div className="d-flex gap-2">
            <span className="text-muted me-2">
              <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
              {currentUser} | {currentDateTime}
            </span>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Export as CSV</Tooltip>}
            >
              <Button variant="outline-secondary" size="sm">
                <FontAwesomeIcon icon={faFileCsv} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Export as PDF</Tooltip>}
            >
              <Button variant="outline-secondary" size="sm">
                <FontAwesomeIcon icon={faFilePdf} />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default MapHeader;