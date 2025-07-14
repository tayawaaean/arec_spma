import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faBolt, faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import mqtt from 'mqtt';
import { calculateTotalPower, countTotalPanels } from '../../utils/solarPumpData';
import { STATUS_COLORS } from '../../utils/constants';
import { pumpService } from '../../utils/pumpApi';

const MQTT_WS_URL = "ws://mqtt.arecmmsu.com:9001"; // Replace with your MQTT broker's WebSocket URL

const PumpOverview = () => {
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPower: '0kW',
    totalPanels: 0,
    pumpsByStatus: { active: 0, maintenance: 0, inactive: 0 }
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const mqttClientRef = useRef(null);

  // Count pumps by status
  const countPumpsByStatus = (pumpList) => {
    return pumpList.reduce((counts, pump) => {
      if (pump.status) {
        counts[pump.status] = (counts[pump.status] || 0) + 1;
      }
      return counts;
    }, { active: 0, maintenance: 0, inactive: 0 });
  };

  // Fetch pumps meta info ONCE on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await pumpService.getAllPumps({});
        const pumpData = response.data || [];
        setPumps(pumpData);
      } catch (err) {
        setError('Failed to load pump overview data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // MQTT operational status subscription
  useEffect(() => {
    if (pumps.length === 0) return;

    const mqttClient = mqtt.connect(MQTT_WS_URL, {
      username: "arec", // Set if needed
      password: "arecmqtt", // Set if needed
      reconnectPeriod: 3000
    });
    mqttClientRef.current = mqttClient;

    // Subscribe to all operational_status topics
    pumps.forEach((pump) => {
      const topic = `arec/pump/${pump.solarPumpNumber}/operational_status`;
      mqttClient.subscribe(topic);
    });

    mqttClient.on('message', (topic, message) => {
      const match = topic.match(/^arec\/pump\/(\d+)\/operational_status$/);
      if (!match) return;
      const pumpNumber = parseInt(match[1], 10);
      const status = message.toString();

      // Update pump status in state
      setPumps((prevPumps) =>
        prevPumps.map((p) =>
          p.solarPumpNumber === pumpNumber ? { ...p, status } : p
        )
      );
    });

    mqttClient.on('error', (err) => {
      setError('MQTT connection error: ' + err.message);
    });

    return () => {
      mqttClient.end(true);
    };
  }, [pumps.length]);

  // Update stats whenever pumps changes
  useEffect(() => {
    setStats({
      totalPower: calculateTotalPower(pumps),
      totalPanels: countTotalPanels(pumps),
      pumpsByStatus: countPumpsByStatus(pumps),
    });
    setLastUpdate(new Date());
  }, [pumps]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading pump data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  const activePumps = stats.pumpsByStatus.active || 0;
  const inactivePumps = stats.pumpsByStatus.inactive || 0;
  const maintenancePumps = stats.pumpsByStatus.maintenance || 0;

  return (
    <>
      <h6 className="mb-3">
        <FontAwesomeIcon icon={faChartPie} className="me-2 text-primary" />
        Pump Status Overview
      </h6>

      <div className="d-flex justify-content-between mb-3">
        <div className="text-center">
          <div className="stat-number text-success">{activePumps}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="text-center">
          <div className="stat-number text-warning">{maintenancePumps}</div>
          <div className="stat-label">Maintenance</div>
        </div>
        <div className="text-center">
          <div className="stat-number text-danger">{inactivePumps}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      <hr className="my-3" />

      <Row className="small-stats">
        <Col xs={6} className="mb-3">
          <div className="d-flex align-items-center">
            <div className="stat-icon bg-primary-soft">
              <FontAwesomeIcon icon={faBolt} className="text-primary" />
            </div>
            <div className="ms-2">
              <div className="stat-value">{stats.totalPower}</div>
              <div className="stat-label">Total Power</div>
            </div>
          </div>
        </Col>
        <Col xs={6} className="mb-3">
          <div className="d-flex align-items-center">
            <div className="stat-icon bg-info-soft">
              <FontAwesomeIcon icon={faSolarPanel} className="text-info" />
            </div>
            <div className="ms-2">
              <div className="stat-value">{stats.totalPanels}</div>
              <div className="stat-label">Solar Panels</div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="text-center mt-3">
        <small className="text-muted">
          Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : ""}
        </small>
      </div>
    </>
  );
};

export default PumpOverview;