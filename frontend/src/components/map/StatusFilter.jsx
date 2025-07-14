import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircle } from '@fortawesome/free-solid-svg-icons';

const StatusFilter = ({ statusFilter, handleStatusFilter, searchQuery, setSearchQuery }) => {
  return (
    <Row className="mb-3">
      <Col md={5}>
        <div className="search-filter d-flex">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0">
              <FontAwesomeIcon icon={faSearch} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search pumps by ID, model or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                borderColor: 'var(--card-border)'
              }}
            />
          </div>
        </div>
      </Col>
      <Col md={7}>
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => handleStatusFilter('all')}
          >
            All Pumps
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'success' : 'outline-success'}
            size="sm"
            onClick={() => handleStatusFilter('active')}
          >
            <FontAwesomeIcon icon={faCircle} className="text-success me-1" size="xs" />
            Active
          </Button>
          <Button
            variant={statusFilter === 'maintenance' ? 'warning' : 'outline-warning'}
            size="sm"
            onClick={() => handleStatusFilter('maintenance')}
          >
            <FontAwesomeIcon icon={faCircle} className="text-warning me-1" size="xs" />
            Maintenance
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'danger' : 'outline-danger'}
            size="sm"
            onClick={() => handleStatusFilter('inactive')}
          >
            <FontAwesomeIcon icon={faCircle} className="text-danger me-1" size="xs" />
            Inactive
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default StatusFilter;