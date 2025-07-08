import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const RecentActivity = () => {
  // This could come from props or an API in a real app
  const activities = [
    {
      id: 1,
      pumpNumber: 2,
      action: 'Status changed to Active',
      timestamp: '2025-07-08 04:15:33',
      status: 'active'
    },
    {
      id: 2,
      pumpNumber: 3,
      action: 'Maintenance scheduled',
      timestamp: '2025-07-08 02:45:02',
      status: 'maintenance'
    },
    {
      id: 3,
      pumpNumber: 5,
      action: 'Pump went offline',
      timestamp: '2025-07-07 18:32:10',
      status: 'offline'
    },
    {
      id: 4,
      pumpNumber: null,
      action: 'Daily pump reports generated',
      timestamp: '2025-07-07 00:00:01',
      status: 'info'
    }
  ];

  // Get status color for activity icon
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'offline': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div>
      <h5 className="mb-3">Recent Activity</h5>
      <div className="activity-feed">
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