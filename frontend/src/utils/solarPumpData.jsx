// Solar pump data and related utility functions

// Sample solar pump locations based on the provided database schema
export const solarPumps = [
    { 
      _id: "68671e4ababf10848c8f9c61",
      solarPumpNumber: 1,
      model: "SPX-1500",
      power: "1.5kW",
      acInputVoltage: "220V",
      pvOperatingVoltage: "200V",
      openCircuitVoltage: "240V",
      outlet: "2 inch",
      maxHead: "35m",
      maxFlow: "10m3/h",
      solarPanelConfig: "6x300W",
      lat: 14.5995,
      lng: 120.9842,
      address: {
        barangay: "Quiapo",
        municipality: "Manila",
        region: "Metro Manila",
        country: "Philippines"
      },
      timeInstalled: "2025-07-01T08:00:00.000Z",
      status: "active",
      createdAt: "2025-07-04T00:20:26.631Z",
      updatedAt: "2025-07-04T00:20:26.631Z"
    },
    { 
      _id: "68671e4ababf10848c8f9c62",
      solarPumpNumber: 2,
      model: "SPX-2000",
      power: "2.0kW",
      acInputVoltage: "220V",
      pvOperatingVoltage: "220V",
      openCircuitVoltage: "260V",
      outlet: "2.5 inch",
      maxHead: "40m",
      maxFlow: "15m3/h",
      solarPanelConfig: "8x300W",
      lat: 10.3157,
      lng: 123.8854,
      address: {
        barangay: "Downtown",
        municipality: "Cebu City",
        region: "Central Visayas",
        country: "Philippines"
      },
      timeInstalled: "2025-06-15T09:30:00.000Z",
      status: "active",
      createdAt: "2025-07-04T00:22:18.251Z",
      updatedAt: "2025-07-04T00:22:18.251Z"
    },
    { 
      _id: "68671e4ababf10848c8f9c63",
      solarPumpNumber: 3,
      model: "SPX-1800",
      power: "1.8kW",
      acInputVoltage: "220V",
      pvOperatingVoltage: "210V",
      openCircuitVoltage: "250V",
      outlet: "2 inch",
      maxHead: "38m",
      maxFlow: "12m3/h",
      solarPanelConfig: "7x300W",
      lat: 7.1907,
      lng: 125.4553,
      address: {
        barangay: "Poblacion",
        municipality: "Davao City",
        region: "Davao Region",
        country: "Philippines"
      },
      timeInstalled: "2025-06-20T10:15:00.000Z",
      status: "maintenance",
      createdAt: "2025-07-04T00:25:44.192Z",
      updatedAt: "2025-07-04T00:25:44.192Z"
    },
    { 
      _id: "68671e4ababf10848c8f9c64",
      solarPumpNumber: 4,
      model: "SPX-1200",
      power: "1.2kW",
      acInputVoltage: "220V",
      pvOperatingVoltage: "180V",
      openCircuitVoltage: "220V",
      outlet: "1.5 inch",
      maxHead: "30m",
      maxFlow: "8m3/h",
      solarPanelConfig: "5x300W",
      lat: 16.4023,
      lng: 120.5960,
      address: {
        barangay: "Session Road",
        municipality: "Baguio City",
        region: "Cordillera Administrative Region",
        country: "Philippines"
      },
      timeInstalled: "2025-06-25T11:00:00.000Z",
      status: "active",
      createdAt: "2025-07-04T00:28:12.584Z",
      updatedAt: "2025-07-04T00:28:12.584Z"
    },
    { 
      _id: "68671e4ababf10848c8f9c65",
      solarPumpNumber: 5,
      model: "SPX-900",
      power: "0.9kW",
      acInputVoltage: "220V",
      pvOperatingVoltage: "160V",
      openCircuitVoltage: "200V",
      outlet: "1 inch",
      maxHead: "25m",
      maxFlow: "5m3/h",
      solarPanelConfig: "4x300W",
      lat: 9.8349,
      lng: 118.7384,
      address: {
        barangay: "Bancao-Bancao",
        municipality: "Puerto Princesa",
        region: "MIMAROPA",
        country: "Philippines"
      },
      timeInstalled: "2025-06-30T09:45:00.000Z",
      status: "offline",
      createdAt: "2025-07-04T00:30:55.971Z",
      updatedAt: "2025-07-04T00:30:55.971Z"
    }
  ];
  
  // Helper functions for solar pumps
  
  /**
   * Format a date string to a more readable format
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  /**
   * Calculate total power from an array of solar pumps
   * @param {Array} pumps - Array of solar pump objects
   * @returns {string} - Total power in kW
   */
  export const calculateTotalPower = (pumps) => {
    const total = pumps.reduce((sum, pump) => {
      // Extract the numeric part of the power string (e.g., "1.5kW" -> 1.5)
      const powerValue = parseFloat(pump.power.replace('kW', ''));
      return sum + powerValue;
    }, 0);
    
    return total.toFixed(1) + 'kW';
  };
  
  /**
   * Filter solar pumps by status
   * @param {Array} pumps - Array of solar pump objects
   * @param {string} status - Status to filter by
   * @returns {Array} - Filtered array of pumps
   */
  export const filterPumpsByStatus = (pumps, status) => {
    if (status === 'all') return pumps;
    return pumps.filter(pump => pump.status.toLowerCase() === status.toLowerCase());
  };
  
  /**
   * Count solar pumps by status
   * @param {Array} pumps - Array of solar pump objects
   * @returns {Object} - Object with counts by status
   */
  export const countPumpsByStatus = (pumps) => {
    return pumps.reduce((counts, pump) => {
      counts[pump.status] = (counts[pump.status] || 0) + 1;
      return counts;
    }, {});
  };
  
  /**
   * Group pumps by model
   * @param {Array} pumps - Array of solar pump objects
   * @returns {Object} - Object with pumps grouped by model
   */
  export const groupPumpsByModel = (pumps) => {
    return pumps.reduce((groups, pump) => {
      if (!groups[pump.model]) {
        groups[pump.model] = [];
      }
      groups[pump.model].push(pump);
      return groups;
    }, {});
  };
  
  /**
   * Count total solar panels from the configuration
   * @param {Array} pumps - Array of solar pump objects
   * @returns {number} - Total number of solar panels
   */
  export const countTotalPanels = (pumps) => {
    return pumps.reduce((total, pump) => {
      // Extract the configuration like "6x300W" and get the number
      const panelCount = parseInt(pump.solarPanelConfig.split('x')[0]);
      return total + panelCount;
    }, 0);
  };