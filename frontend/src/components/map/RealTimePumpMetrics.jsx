import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTint, faBolt, faChartLine, 
  faTachometerAlt, faExclamationTriangle, faClock
} from '@fortawesome/free-solid-svg-icons';

// Accept pumpId (or pumpNumber) as a prop
const MQTT_BROKER_URL = 'ws://mqtt.arecmmsu.com:9001';
// If your pump topics use an integer or string ID, use that for the topic construction

const RealTimePumpMetrics = ({ pumpId }) => {
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    if (!pumpId) return; // Don't connect if no pump selected

    const topic = `arec/pump/${pumpId}`;
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: 'arec',
      password: 'arecmqtt',
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      setStatus('Connected, waiting for data...');
      client.subscribe(topic);
    });

    client.on('message', (topicMsg, message) => {
      if (topicMsg === topic) {
        try {
          const data = JSON.parse(message.toString());
          setMetrics(data);
        } catch {
          setStatus('Received malformed data');
        }
      }
    });

    client.on('error', () => setStatus('Connection error'));
    client.on('close', () => setStatus('Disconnected'));

    return () => client.end();
  }, [pumpId]);

  if (!pumpId) return <div className="text-muted">No pump selected</div>;
  if (!metrics) return (
    <div className="text-center my-4">
      <Spinner animation="border" size="sm" className="me-2" />
      <span>{status}</span>
    </div>
  );

  return (
    <div className="real-time-metrics mt-2">
      <h6 className="d-flex align-items-center mb-3">
        <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
        Real-Time Metrics
      </h6>
      <Row className="g-2">
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Voltage</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faBolt} className="me-2 text-warning" />
              <span className="h5 mb-0">{metrics.filtered_voltage}</span>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="metric-card p-2 rounded">
            <div className="text-muted small">Current</div>
            <div className="d-flex align-items-end">
              <FontAwesomeIcon icon={faBolt} className="me-2 text-info" />
              <span className="h5 mb-0">{metrics.filtered_current}</span>
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
              <span className="h5 mb-0">{metrics.flow}</span>
            </div>
          </div>
        </Col>
      </Row>
      <div className="daily-totals p-2 rounded bg-dark mt-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="text-muted small">Accumulated Energy</div>
          <div className="fw-bold">{metrics.accumulated_energy_wh} Wh</div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Total Water Volume</div>
          <div className="fw-bold">{metrics.total_water_volume} L</div>
        </div>
      </div>
      <div className="text-end mt-2">
        <span className="text-muted small">
          <FontAwesomeIcon icon={faClock} className="me-1" />
          {metrics.time}
        </span>
      </div>
    </div>
  );
};

export default RealTimePumpMetrics;