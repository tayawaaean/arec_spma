import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faCaretDown, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PumpSelector = ({ pumps, selectedPumps, setSelectedPumps }) => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const pumpsPerPage = 5;
  
  // Calculate total pages
  const totalPages = Math.ceil(pumps.length / pumpsPerPage);
  
  // Get current pumps
  const indexOfLastPump = currentPage * pumpsPerPage;
  const indexOfFirstPump = indexOfLastPump - pumpsPerPage;
  const currentPumps = pumps.slice(indexOfFirstPump, indexOfLastPump);
  
  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPumps(pumps.map(pump => pump.id));
    } else {
      setSelectedPumps([]);
    }
  };

  // Handle individual pump selection
  const handlePumpSelect = (pumpId) => {
    if (selectedPumps.includes(pumpId)) {
      setSelectedPumps(selectedPumps.filter(id => id !== pumpId));
    } else {
      setSelectedPumps([...selectedPumps, pumpId]);
    }
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const allSelected = pumps.length === selectedPumps.length;
  
  // Get display text for button
  const getButtonText = () => {
    if (selectedPumps.length === 0) {
      return "No pumps selected";
    } else if (selectedPumps.length === pumps.length) {
      return "All pumps selected";
    } else if (selectedPumps.length === 1) {
      const selectedPump = pumps.find(p => p.id === selectedPumps[0]);
      return selectedPump ? selectedPump.name : "1 pump selected";
    } else {
      return `${selectedPumps.length} pumps selected`;
    }
  };

  return (
    <div className="position-relative custom-dropdown" ref={dropdownRef}>
      <Form.Group>
        <Form.Label className="filter-label">
          Select Pumps
        </Form.Label>
        
        <Button
          variant="outline-secondary"
          onClick={() => setShow(!show)}
          className="d-flex justify-content-between align-items-center w-100 dropdown-toggle-btn"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0'
          }}
        >
          <span>{getButtonText()}</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </Button>
      </Form.Group>
      
      {show && (
        <div 
          className="dropdown-menu show pumps-dropdown-menu" 
          style={{ 
            width: "100%",
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "5px",
            zIndex: 9999
          }}
        >
          <div className="px-2 py-1">
            <Form.Check
              type="checkbox"
              id="select-all-pumps"
              label="Select All Pumps"
              checked={allSelected}
              onChange={handleSelectAll}
              className="mb-2"
            />
            
            <hr style={{ margin: '0.5rem 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <div>
              {currentPumps.map(pump => (
                <div 
                  key={pump.id} 
                  className="d-flex align-items-center mb-1 p-1 hover-highlight" 
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onClick={() => handlePumpSelect(pump.id)}
                >
                  <Form.Check
                    type="checkbox"
                    id={`pump-${pump.id}`}
                    checked={selectedPumps.includes(pump.id)}
                    onChange={() => {}} // Handled by parent div onClick
                    className="me-2"
                    onClick={(e) => e.stopPropagation()} // Prevent double-triggering
                  />
                  <span>{pump.name}</span>
                  {selectedPumps.includes(pump.id) && (
                    <FontAwesomeIcon icon={faCheck} className="ms-auto text-primary" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button 
                  variant="link" 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="p-0 text-primary"
                  size="sm"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Prev
                </Button>
                <div className="text-muted small">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="link" 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className="p-0 text-primary"
                  size="sm"
                >
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            )}
            
            <div className="d-flex justify-content-end mt-2">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setShow(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0'
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpSelector;