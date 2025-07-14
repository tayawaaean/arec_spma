function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  export async function getMqttSettings() {
    const response = await fetch('http://localhost:5000/api/mqtt-credentials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch MQTT settings');
    }
    return response.json();
  }
  
  export async function updateMqttCredentials({ brokerUrl, username, password }) {
    const response = await fetch('http://localhost:5000/api/mqtt-credentials/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ brokerUrl, username, password })
    });
  
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update MQTT credentials');
    }
    return response.json();
  }
  
  export async function resetToDefaultMqttSettings() {
    const response = await fetch('http://localhost:5000/api/mqtt-credentials/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      }
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to reset MQTT settings');
    }
    return response.json();
  }