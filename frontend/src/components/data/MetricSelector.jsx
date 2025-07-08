import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const MetricSelector = ({ metrics, selectedMetrics, setSelectedMetrics }) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMetrics(metrics.map(metric => metric.value));
    } else {
      setSelectedMetrics([]);
    }
  };

  // Handle individual metric selection
  const handleMetricSelect = (metricValue) => {
    if (selectedMetrics.includes(metricValue)) {
      setSelectedMetrics(selectedMetrics.filter(value => value !== metricValue));
    } else {
      setSelectedMetrics([...selectedMetrics, metricValue]);
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

  const allSelected = metrics.length === selectedMetrics.length;
  
  // Get display text for button
  const getButtonText = () => {
    if (selectedMetrics.length === 0) {
      return "No metrics selected";
    } else if (selectedMetrics.length === metrics.length) {
      return "All metrics selected";
    } else if (selectedMetrics.length === 1) {
      const selectedMetric = metrics.find(m => m.value === selectedMetrics[0]);
      return selectedMetric ? selectedMetric.label : "1 metric selected";
    } else {
      return `${selectedMetrics.length} metrics selected`;
    }
  };

  return (
    <div 
      className="position-relative custom-dropdown metrics-dropdown" 
      ref={dropdownRef} 
      id="metrics-dropdown"
      data-testid="metrics-selector"
    >
      <Form.Group>
        <Form.Label className="filter-label">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          Select Metrics
        </Form.Label>
        
        <Button
          variant="outline-secondary"
          onClick={() => setShow(!show)}
          className="d-flex justify-content-between align-items-center w-100"
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid var(--filter-border)',
            color: 'var(--text-primary)'
          }}
        >
          <span>{getButtonText()}</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </Button>
      </Form.Group>
      
      {show && (
        <div 
          className="dropdown-menu show metrics-dropdown-menu" 
          style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--filter-border)',
            borderRadius: '0.25rem',
            padding: '10px',
            position: 'absolute',
            width: '100%',
            zIndex: 99999
          }}
        >
          <Form.Check
            type="checkbox"
            id="select-all-metrics"
            label="Select All Metrics"
            checked={allSelected}
            onChange={handleSelectAll}
            className="mb-2"
          />
          
          <hr style={{ margin: '0.5rem 0', borderColor: 'var(--filter-border)' }} />
          
          <div>
            {metrics.map(metric => (
              <div 
                key={metric.value}
                className="d-flex align-items-center mb-1 p-1 hover-highlight"
                style={{ 
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onClick={() => handleMetricSelect(metric.value)}
              >
                <Form.Check
                  type="checkbox"
                  id={`metric-${metric.value}`}
                  checked={selectedMetrics.includes(metric.value)}
                  onChange={() => {}} // Handled by parent div onClick
                  className="me-2"
                  onClick={(e) => e.stopPropagation()} // Prevent double-triggering
                />
                <div 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: metric.color,
                    borderRadius: '2px',
                    marginRight: '8px'
                  }} 
                />
                <span>{metric.label}</span>
                {selectedMetrics.includes(metric.value) && (
                  <FontAwesomeIcon icon={faCheck} className="ms-auto text-primary" />
                )}
              </div>
            ))}
          </div>
          
          <div className="d-flex justify-content-end mt-2">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setShow(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--filter-border)',
                color: 'var(--text-primary)'
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricSelector;