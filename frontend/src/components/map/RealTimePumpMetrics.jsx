import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTint, faBolt, faChartLine, 
  faTachometerAlt, faExclamationTriangle, faClock
} from '@fortawesome/free-solid-svg-icons';

import { getPumpRealTimeMetrics } from '../../services/pumpMetricsService';

const RealTimePumpMetrics = ({ pumpId, onDataLoaded }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getPumpRealTimeMetrics(pumpId);
        
        if (isMounted) {
          setMetrics(data);
          setError(null);
          if (onDataLoaded) onDataLoaded(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load real-time metrics. Please try again.');
          console.error('Error fetching pump metrics:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Refresh every 30 seconds automatically
    const refreshTimer = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [pumpId, refreshCount]);

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  if (loading && !metrics) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" size="sm" className="me-2" />
        <span>Loading real-time metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="py-2 mt-3">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        {error}
      </Alert>
    );
  }

  if (!metrics) return null;

  return (
    <div className="real-time-metrics mt-2">
      <h6 className="d-flex align-items-center mb-3">
        <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
        Real-Time Metrics
        {loading && <Spinner animation="border" size="sm" className="ms-auto" />}
      </h6>
      
      <Row className="g-2">
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Voltage</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faBolt} className="me-2 text-warning" />
              <span className="h5 mb-0">{metrics.voltage}</span>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Current</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faBolt} className="me-2 text-info" />
              <span className="h5 mb-0">{metrics.current}</span>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Power</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2 text-success" />
              <span className="h5 mb-0">{metrics.power}</span>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Water Flow</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faTint} className="me-2 text-primary" />
              <span className="h5 mb-0">{metrics.waterFlow}</span>
            </div>
          </div>
        </Col>
      </Row>
      
      <h6 className="mt-3 mb-2 text-muted">Daily Totals</h6>
      <div className="daily-totals p-2 rounded bg-dark">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="text-muted small">Total Volume Today</div>
          <div className="fw-bold">{metrics.dailyVolume}</div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Total Energy Today</div>
          <div className="fw-bold">{metrics.dailyKwh}</div>
        </div>
      </div>
      
      {metrics.alerts && metrics.alerts.length > 0 && (
        <div className="mt-3">
          <div className="text-muted small d-flex align-items-center mb-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Alerts
          </div>
          {metrics.alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type} className="py-1 px-2 mb-1 small">
              {alert.message}
            </Alert>
          ))}
        </div>
      )}
      
      <div className="text-end mt-2">
        <span className="text-muted small">
          <FontAwesomeIcon icon={faClock} className="me-1" />
          {formatTimestamp(metrics.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default RealTimePumpMetrics;