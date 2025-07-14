import React, { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

// Helper for status to color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'maintenance': return 'warning';
    case 'inactive': return 'danger';
    default: return 'info';
  }
};
const getStatusAction = (status) => {
  switch (status) {
    case 'active': return 'Status changed to Active';
    case 'maintenance': return 'Maintenance required';
    case 'inactive': return 'Pump set to Inactive';
    default: return `Status changed to ${status}`;
  }
};
const MAX_ACTIVITIES = 3;
const API_URL = '/api/pumpActivity/recent';
const MQTT_WS_URL = "ws://mqtt.arecmmsu.com:9001";
const MQTT_USERNAME = "arec";
const MQTT_PASSWORD = "arecmqtt";

// Example: getToken can be from localStorage, context, etc.
function getToken() {
  return localStorage.getItem('token'); // or however you store the token
}

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const mqttClientRef = useRef(null);

  // Fetch recent activities from backend on mount, with Authorization header
  useEffect(() => {
    async function fetchRecentActivities() {
      try {
        const token = getToken();
        const response = await fetch(API_URL, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        const formatted = data.map(act => ({
          ...act,
          id: act._id || act.id,
          timestamp: act.timestamp
            ? new Date(act.timestamp).toISOString().slice(0, 19).replace('T', ' ')
            : '',
        }));
        setActivities(formatted.slice(0, MAX_ACTIVITIES));
      } catch (e) {
        // Optionally handle fetch error
      }
    }
    fetchRecentActivities();
  }, []);

  // MQTT subscription for real-time updates
  useEffect(() => {
    const client = mqtt.connect(MQTT_WS_URL, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      reconnectPeriod: 5000,
    });
    mqttClientRef.current = client;

    client.on('connect', () => {
      client.subscribe('arec/pump/+/operational_status');
    });

    client.on('message', (topic, message) => {
      const match = topic.match(/^arec\/pump\/(\d+)\/operational_status$/);
      if (!match) return;
      const pumpNumber = parseInt(match[1], 10);
      const status = message.toString();

      if (!['active', 'maintenance', 'inactive'].includes(status)) return;

      const newActivity = {
        id: Date.now(),
        pumpNumber,
        action: getStatusAction(status),
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status
      };

      setActivities(prevActivities => {
        const updated = [newActivity, ...prevActivities].slice(0, MAX_ACTIVITIES);
        return updated;
      });
    });

    return () => {
      client.end(true);
    };
  }, []);

  return (
    <div>
      <h5 className="mb-3">Recent Activity</h5>
      <div className="activity-feed">
        {activities.length === 0 && (
          <div className="text-muted small text-center py-3">No recent status changes yet.</div>
        )}
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`activity-item d-flex ${index < activities.length - 1 ? 'pb-3 mb-3 border-bottom' : ''}`}
          >
            <div className={`activity-icon bg-${getStatusColor(activity.status)} me-3`}>
              <FontAwesomeIcon icon={faCircle} size="xs" />
            </div>
            <div>
              <div className="small fw-bold">
                {activity.pumpNumber ? `Solar Pump #${activity.pumpNumber}` : 'System'}
              </div>
              <div className="text-muted small">{activity.action}</div>
              <div className="text-muted smaller">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;