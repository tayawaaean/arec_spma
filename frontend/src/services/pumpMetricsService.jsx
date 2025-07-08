/**
 * Service for fetching real-time solar pump metrics
 * In a production app, this would connect to your API/WebSocket server
 */

// Simulated metrics data store
const pumpMetricsCache = {};

// Last update timestamps
const lastUpdateTimes = {};

/**
 * Get the current real-time metrics for a pump
 * @param {string} pumpId - The pump ID to fetch metrics for
 * @returns {Promise} - Promise resolving to the metrics data
 */
export const getPumpRealTimeMetrics = async (pumpId) => {
  // In a real app, this would be an API call
  // For demo purposes, we'll generate simulated data
  
  // Check if we have recent data in cache (less than 30 seconds old)
  const now = Date.now();
  const lastUpdate = lastUpdateTimes[pumpId] || 0;
  
  if (pumpMetricsCache[pumpId] && now - lastUpdate < 30000) {
    return pumpMetricsCache[pumpId];
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate random data for the pump (in a real app, this would come from your API)
  const randomizeWithin = (base, variance) => (base + (Math.random() * variance * 2) - variance).toFixed(1);
  
  // Different base values for each pump to simulate different performance
  const pumpIdNum = parseInt(pumpId.substring(pumpId.length - 2), 16) || 1;
  const baseVoltage = 220 + (pumpIdNum % 3) * 10; // 220, 230, or 240 base voltage
  const baseCurrent = 3 + (pumpIdNum % 3); // 3-5 amps
  const basePower = (baseVoltage * baseCurrent * 0.85 / 1000).toFixed(2); // Power in kW
  const baseFlow = 6 + (pumpIdNum % 5); // 6-10 base flow rate
  
  // Check if this is the first time today for this pump
  // In a real app, this would be tracked in your database
  const today = new Date().toLocaleDateString();
  const lastRunDay = localStorage.getItem(`pump_${pumpId}_lastDay`) || '';
  
  // Total volume and kWh for today (reset if it's a new day)
  let dailyVolume = 0;
  let dailyKwh = 0;
  
  if (lastRunDay !== today) {
    // Reset for new day
    localStorage.setItem(`pump_${pumpId}_lastDay`, today);
    localStorage.setItem(`pump_${pumpId}_dailyVolume`, '0');
    localStorage.setItem(`pump_${pumpId}_dailyKwh`, '0');
  } else {
    // Get current day totals
    dailyVolume = parseFloat(localStorage.getItem(`pump_${pumpId}_dailyVolume`) || '0');
    dailyKwh = parseFloat(localStorage.getItem(`pump_${pumpId}_dailyKwh`) || '0');
    
    // Increment the values (in a real system this would come from actual sensors)
    // We're simulating accumulated values since last check
    const timeElapsedHours = (now - lastUpdate) / 3600000 || 0.008; // Default to ~30 sec if first run
    const newVolume = parseFloat(baseFlow) * timeElapsedHours;
    const newKwh = parseFloat(basePower) * timeElapsedHours;
    
    dailyVolume += newVolume;
    dailyKwh += newKwh;
    
    // Store the updated values
    localStorage.setItem(`pump_${pumpId}_dailyVolume`, dailyVolume.toString());
    localStorage.setItem(`pump_${pumpId}_dailyKwh`, dailyKwh.toString());
  }
  
  const metrics = {
    voltage: `${randomizeWithin(baseVoltage, 5)}V`,
    current: `${randomizeWithin(baseCurrent, 0.4)}A`,
    power: `${randomizeWithin(basePower, 0.15)}kW`,
    waterFlow: `${randomizeWithin(baseFlow, 0.8)}m³/h`,
    dailyVolume: `${dailyVolume.toFixed(1)}m³`,
    dailyKwh: `${dailyKwh.toFixed(1)}kWh`,
    timestamp: new Date().toISOString(),
    alerts: []
  };

  // Add some random alerts occasionally
  if (Math.random() > 0.7) {
    if (parseFloat(metrics.voltage) < 215) {
      metrics.alerts.push({ 
        type: 'warning', 
        message: 'Low voltage detected' 
      });
    }
    if (parseFloat(metrics.current) > 4.8) {
      metrics.alerts.push({ 
        type: 'danger', 
        message: 'High current draw' 
      });
    }
    if (parseFloat(metrics.waterFlow) < 5.5) {
      metrics.alerts.push({ 
        type: 'info', 
        message: 'Flow rate below optimal' 
      });
    }
  }

  // Store in cache and update timestamp
  pumpMetricsCache[pumpId] = metrics;
  lastUpdateTimes[pumpId] = now;
  
  return metrics;
};

/**
 * Get historical metrics for a pump
 * @param {string} pumpId - The pump ID
 * @param {string} startDate - ISO date string for start date
 * @param {string} endDate - ISO date string for end date
 * @returns {Promise} - Promise resolving to historical metrics
 */
export const getPumpHistoricalMetrics = async (pumpId, startDate, endDate) => {
  // In a real app, this would fetch from your API
  // For demo purposes, we'll return mock data
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  // Generate daily data points
  const dailyData = Array.from({ length: daysDiff }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    // Random fluctuation but with a trend
    const efficiency = 70 + Math.sin(i * 0.3) * 10 + Math.random() * 5;
    const flow = 6 + Math.sin(i * 0.2) * 2 + Math.random() * 1;
    const voltage = 200 + Math.sin(i * 0.1) * 10 + Math.random() * 5;
    const current = 3 + Math.sin(i * 0.25) * 0.5 + Math.random() * 0.3;
    const powerOutput = parseFloat((voltage * current * 0.85 / 1000).toFixed(2));
    
    // Daily totals (simulating 8 hours of operation)
    const dailyVolume = parseFloat((flow * 8).toFixed(1));
    const dailyKwh = parseFloat((powerOutput * 8).toFixed(1));
    
    return {
      date: date.toISOString().split('T')[0],
      efficiency: parseFloat(efficiency.toFixed(1)),
      flow: parseFloat(flow.toFixed(1)),
      voltage: parseFloat(voltage.toFixed(1)),
      current: parseFloat(current.toFixed(1)),
      powerOutput,
      dailyVolume,
      dailyKwh
    };
  });
  
  return {
    pumpId,
    dailyData,
    summary: {
      avgEfficiency: parseFloat((dailyData.reduce((sum, day) => sum + day.efficiency, 0) / dailyData.length).toFixed(1)),
      avgFlow: parseFloat((dailyData.reduce((sum, day) => sum + day.flow, 0) / dailyData.length).toFixed(1)),
      avgPowerOutput: parseFloat((dailyData.reduce((sum, day) => sum + day.powerOutput, 0) / dailyData.length).toFixed(2)),
      totalWaterPumped: parseFloat((dailyData.reduce((sum, day) => sum + day.dailyVolume, 0)).toFixed(0)),
      totalKwh: parseFloat((dailyData.reduce((sum, day) => sum + day.dailyKwh, 0)).toFixed(0))
    }
  };
};

/**
 * Get daily metrics summary for all pumps
 * @returns {Promise} - Promise resolving to daily summary metrics
 */
export const getDailyPumpMetricsSummary = async () => {
  // In a real app, this would be an API call
  // For demo purposes, we'll generate simulated data
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29); // 30 days including today
  
  // Generate daily summary data
  const dailySummary = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Baseline values with some random variation
    const baseVolume = 380 + (i * 2); // Slightly increasing trend
    const baseEnergy = 42 + (i * 0.25); // Slightly increasing trend
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1 random factor
    
    // Weekend dips (assuming 1st day is a Monday)
    const isWeekend = (i % 7 === 5) || (i % 7 === 6);
    const weekendFactor = isWeekend ? 0.8 : 1.0;
    
    // Weather effects (simulate cloudy days)
    const isCloudy = Math.random() > 0.7;
    const cloudyFactor = isCloudy ? 0.85 : 1.0;
    
    return {
      date: dateStr,
      totalVolume: parseFloat((baseVolume * randomFactor * weekendFactor * cloudyFactor).toFixed(1)),
      totalEnergy: parseFloat((baseEnergy * randomFactor * weekendFactor * cloudyFactor).toFixed(1)),
      activePumps: isWeekend ? 4 : 5,
      efficiencyScore: parseFloat((85 * weekendFactor * cloudyFactor).toFixed(1)),
      weather: isCloudy ? 'Cloudy' : (Math.random() > 0.5 ? 'Sunny' : 'Partly Cloudy')
    };
  });
  
  return {
    dailySummary,
    monthlyTotals: {
      totalVolume: parseFloat(dailySummary.reduce((sum, day) => sum + day.totalVolume, 0).toFixed(0)),
      totalEnergy: parseFloat(dailySummary.reduce((sum, day) => sum + day.totalEnergy, 0).toFixed(0)),
      avgEfficiency: parseFloat((dailySummary.reduce((sum, day) => sum + day.efficiencyScore, 0) / dailySummary.length).toFixed(1))
    }
  };
};

/**
 * Get alerts for all pumps
 * @returns {Promise} - Promise resolving to alerts data
 */
export const getPumpAlerts = async () => {
  // In a real app, this would be an API call
  // For demo purposes, we'll generate simulated data
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const alertTypes = [
    { type: 'critical', label: 'Critical', color: 'danger' },
    { type: 'warning', label: 'Warning', color: 'warning' },
    { type: 'info', label: 'Info', color: 'info' }
  ];
  
  const alertMessages = [
    { type: 'critical', message: 'Pump failure detected' },
    { type: 'critical', message: 'Excessive current draw' },
    { type: 'critical', message: 'Communication lost' },
    { type: 'warning', message: 'Low voltage detected' },
    { type: 'warning', message: 'Flow rate below threshold' },
    { type: 'warning', message: 'High temperature warning' },
    { type: 'info', message: 'Scheduled maintenance due' },
    { type: 'info', message: 'Performance below optimal' },
    { type: 'info', message: 'System update available' }
  ];
  
  // Generate between 5-12 random alerts
  const numAlerts = 5 + Math.floor(Math.random() * 8);
  const now = new Date();
  
  const alerts = Array.from({ length: numAlerts }, (_, i) => {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const alertMsg = alertMessages.filter(msg => msg.type === alertType.type);
    const message = alertMsg[Math.floor(Math.random() * alertMsg.length)].message;
    
    // Random pump number between 1-5
    const pumpNumber = Math.floor(Math.random() * 5) + 1;
    
    // Random time in the past (0-48 hours ago)
    const randomHoursAgo = Math.random() * 48;
    const timestamp = new Date(now - randomHoursAgo * 60 * 60 * 1000);
    
    return {
      id: `alert-${Date.now()}-${i}`,
      pumpId: `pump-${pumpNumber}`,
      pumpNumber,
      type: alertType.type,
      color: alertType.color,
      message,
      timestamp: timestamp.toISOString(),
      acknowledged: randomHoursAgo > 24, // Older alerts are more likely to be acknowledged
      resolved: randomHoursAgo > 36 && Math.random() > 0.5 // Some older alerts may be resolved
    };
  });
  
  // Sort by timestamp (newest first)
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};