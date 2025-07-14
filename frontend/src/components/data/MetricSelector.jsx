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
      style={{ 
        width: '100%',
        zIndex: show ? 1000 : 1 // Ensure proper stacking
      }}
    >
      <div
        className="metric-selector-card"
        style={{
          background: "#232735",
          borderRadius: "14px",
          padding: "1.05rem 1.2rem 1.05rem 1rem",
          boxShadow: "0 2px 8px 0 rgba(50,80,200,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: show ? "1.5px solid #3b82f6" : "1.5px solid #232941",
          position: "relative",
          minWidth: 220,
        }}
      >
        <Form.Label className="filter-label d-flex align-items-center mb-2" style={{ gap: 7, fontWeight: 600 }}>
          <span className="filter-icon-bg accent-blue" style={{ marginRight: 10, width: 30, height: 30, minWidth: 30 }}>
            <FontAwesomeIcon icon={faChartBar} className="filter-icon" style={{ fontSize: '1.1rem' }} />
          </span>
          Select Metrics <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
        </Form.Label>
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
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '90%',
            textAlign: 'left'
          }}>
            {getButtonText()}
          </span>
          <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 8 }} />
        </Button>
        {show && (
          <div
            className="dropdown-menu show metrics-dropdown-menu"
            style={{
              background: '#232735',
              border: '1.5px solid #3b82f6',
              borderRadius: 13,
              padding: '15px 14px 10px 14px',
              minWidth: 240,
              maxWidth: 340,
              maxHeight: 340,
              overflowY: 'auto',
              zIndex: 9999, // High z-index to ensure it's on top
              boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
              position: 'absolute', // Changed to absolute
              top: '100%', // Position below the button
              left: 0,
              marginTop: 7,
              width: '100%',
            }}
          >
            <Form.Check
              type="checkbox"
              id="select-all-metrics"
              label="Select All Metrics"
              checked={allSelected}
              onChange={handleSelectAll}
              className="mb-2"
              style={{ fontWeight: 600, fontSize: '1.08rem', color: "#f1f6fa" }}
            />

            <hr style={{ margin: '0.5rem 0', borderColor: '#232735', opacity: 0.5 }} />

            <div>
              {metrics.map(metric => (
                <div
                  key={metric.value}
                  className="d-flex align-items-center mb-1 px-2 py-2 hover-highlight"
                  style={{
                    cursor: 'pointer',
                    borderRadius: 7,
                    fontSize: '1rem',
                    minHeight: 38,
                    gap: 12,
                    background: selectedMetrics.includes(metric.value) ? 'rgba(59,130,246,0.10)' : 'none',
                    transition: 'background 0.13s'
                  }}
                  onClick={() => handleMetricSelect(metric.value)}
                >
                  <Form.Check
                    type="checkbox"
                    id={`metric-${metric.value}`}
                    checked={selectedMetrics.includes(metric.value)}
                    onChange={() => {}}
                    className="me-2"
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 0, marginBottom: 0 }}
                  />
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: metric.color,
                      borderRadius: '3px',
                      marginRight: '8px',
                      border: selectedMetrics.includes(metric.value) ? '2px solid #3b82f6' : '2px solid #232735'
                    }}
                  />
                  <span style={{
                    flex: 1,
                    fontWeight: selectedMetrics.includes(metric.value) ? 600 : 400,
                    color: selectedMetrics.includes(metric.value) ? '#3b82f6' : '#e7eaf1'
                  }}>
                    {metric.label}
                  </span>
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
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderColor: '#232735',
                  color: '#e7eaf1',
                  borderRadius: 6,
                  fontWeight: 500,
                  padding: "0.3rem 1.15rem",
                  fontSize: "1.01rem"
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricSelector;