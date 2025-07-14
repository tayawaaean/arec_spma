import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faCaretDown, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PumpSelector = ({ pumps, selectedPumps, setSelectedPumps, allPumpsId = 'all' }) => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const pumpsPerPage = 5;

  // Calculate total pages (skip "all" in count)
  const totalPages = Math.ceil((pumps.length - 1) / pumpsPerPage);

  // "All" is always first
  const allPump = pumps.find(p => p.id === allPumpsId);
  const realPumps = pumps.filter(p => p.id !== allPumpsId);

  // Pagination
  const indexOfLastPump = currentPage * pumpsPerPage;
  const indexOfFirstPump = indexOfLastPump - pumpsPerPage;
  const currentPumps = realPumps.slice(indexOfFirstPump, indexOfLastPump);

  // If all is selected, only it is selected
  const handlePumpSelect = (pumpId) => {
    if (pumpId === allPumpsId) {
      setSelectedPumps([allPumpsId]);
    } else {
      // Remove all if present
      let newSelected = selectedPumps.filter(id => id !== allPumpsId);
      if (newSelected.includes(pumpId)) {
        newSelected = newSelected.filter(id => id !== pumpId);
      } else {
        newSelected = [...newSelected, pumpId];
      }
      if (newSelected.length === 0) {
        // Prevent empty, keep all selected
        setSelectedPumps([allPumpsId]);
      } else {
        setSelectedPumps(newSelected);
      }
    }
  };

  // Select all (include all real pump ids)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPumps([allPumpsId]);
    } else {
      setSelectedPumps([]);
    }
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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

  // UI
  const allSelected = selectedPumps.includes(allPumpsId);

  // Get display text for button
  const getButtonText = () => {
    if (allSelected) {
      return "All Pumps selected";
    } else if (selectedPumps.length === 0) {
      return "No pumps selected";
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

        <Button
  variant="outline-secondary"
  onClick={() => setShow(!show)}
  className="d-flex justify-content-between align-items-center w-100"
  style={{
    background: show ? 'rgba(59, 130, 246, 0.10)' : '#20242e',
    border: show ? '1.5px solid #3b82f6' : '1.5px solid #20242e',
    color: '#f1f6fa',
    fontWeight: 600,
    minHeight: 44,
    borderRadius: 8,
    padding: '0.48rem 1.1rem',
    fontSize: '1.08rem',
    outline: show ? "2px solid #3b82f6" : "none",
    boxShadow: show ? "0 4px 16px 0 rgba(36,130,246,0.10)" : "none"
  }}
>
  <span
    style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '90%',
      textAlign: 'left'
    }}
  >
    {getButtonText()}
  </span>
  <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 8 }} />
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
              label="All Pumps"
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
                    cursor: allSelected ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    opacity: allSelected ? 0.6 : 1
                  }}
                  onClick={() => !allSelected && handlePumpSelect(pump.id)}
                >
                  <Form.Check
                    type="checkbox"
                    id={`pump-${pump.id}`}
                    checked={selectedPumps.includes(pump.id)}
                    disabled={allSelected}
                    onChange={() => {}}
                    className="me-2"
                    onClick={e => e.stopPropagation()}
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