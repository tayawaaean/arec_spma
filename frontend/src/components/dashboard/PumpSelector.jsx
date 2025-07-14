import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSolarPanel, 
  faSearch, 
  faTimes,
  faFilter,
  faSortAmountDown,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';

const PumpSelector = ({ onPumpSelect, selectedPump = null }) => {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch pumps on component mount
  useEffect(() => {
    fetchPumps();
  }, []);

  // Fetch pumps from API
  const fetchPumps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/pumps');
      setPumps(response.data.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pumps:', err);
      setError('Failed to load pumps');
      setLoading(false);
    }
  };

  // Filter pumps based on search and filter
  const filteredPumps = pumps.filter(pump => {
    const matchesSearch = searchTerm === '' || 
      pump.solarPumpNumber?.toString().includes(searchTerm) ||
      pump.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pump.address?.municipality?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || pump.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle pump selection
  const handlePumpSelect = (pump) => {
    onPumpSelect(pump.solarPumpNumber);
    setSearchTerm('');
    setShowSearch(false);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Get selected pump info
  const selectedPumpInfo = pumps.find(p => p.solarPumpNumber === selectedPump);

  return (
    <div className="pump-selector">
      {showSearch ? (
        <div className="search-container bg-dark p-3 rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Select Pump</h6>
            <Button variant="link" className="p-0 text-muted" onClick={() => setShowSearch(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
          
          <div className="d-flex mb-3">
            <div className="search-input-container flex-grow-1 me-2">
              <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search by ID, model or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-4"
                />
                {searchTerm && (
                  <Button 
                    variant="link" 
                    className="position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted"
                    onClick={() => setSearchTerm('')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </div>
            </div>
            
            <Form.Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="warning">Warning</option>
            </Form.Select>
          </div>
          
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" variant="primary" />
              <p className="mb-0 mt-2 small text-muted">Loading pumps...</p>
            </div>
          ) : error ? (
            <div className="text-center text-danger py-3">
              <p className="mb-0">{error}</p>
              <Button variant="link" className="p-0" onClick={fetchPumps}>
                Retry
              </Button>
            </div>
          ) : filteredPumps.length === 0 ? (
            <div className="text-center py-3">
              <p className="mb-0 text-muted">No pumps found</p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button variant="link" className="p-0" onClick={handleReset}>
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="pump-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredPumps.map(pump => (
                <div 
                  key={pump.solarPumpNumber}
                  className={`pump-item p-2 rounded mb-2 ${pump.solarPumpNumber === selectedPump ? 'bg-primary' : 'bg-dark'}`}
                  onClick={() => handlePumpSelect(pump)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faSolarPanel} className="me-2" />
                        <span className="fw-bold">Pump #{pump.solarPumpNumber}</span>
                        <span className="text-muted ms-2 small">({pump.model})</span>
                      </div>
                      <div className="small text-muted d-flex align-items-center mt-1">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                        {pump.address?.municipality || 'Unknown location'}
                      </div>
                    </div>
                    <Badge bg={
                      pump.status === 'active' ? 'success' : 
                      pump.status === 'warning' ? 'warning' : 'danger'
                    }>
                      {pump.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Button 
          variant={selectedPump ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setShowSearch(true)}
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faSolarPanel} className="me-2" />
          {selectedPump ? (
            <>
              Pump #{selectedPump}
              {selectedPumpInfo && (
                <span className="ms-2 small">
                  ({selectedPumpInfo.address?.municipality || ''})
                </span>
              )}
            </>
          ) : (
            'Select Pump'
          )}
        </Button>
      )}
    </div>
  );
};

export default PumpSelector;