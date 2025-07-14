import { api } from '../utils/api';

export const pumpDataService = {
  // Get data for a specific pump
  getAggregateData: async (pumpNumber, interval = 'monthly', start = null, end = null) => {
    try {
      let url = `/pump-data/aggregate/${pumpNumber}?interval=${interval}`;
      
      if (start) url += `&start=${start}`;
      if (end) url += `&end=${end}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for pump ${pumpNumber}:`, error);
      throw error;
    }
  },
  
  // Get data for all pumps (requires backend implementation of the all pumps endpoint)
  getAllPumpsData: async (interval = 'monthly', start = null, end = null) => {
    try {
      let url = `/pump-data/aggregate/all?interval=${interval}`;
      
      if (start) url += `&start=${start}`;
      if (end) url += `&end=${end}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data for all pumps:', error);
      throw error;
    }
  },
  
  // Format data for a single pump
  formatAggregateData: (intervalData) => {
    if (!intervalData || !Array.isArray(intervalData)) {
      return [];
    }
    
    return intervalData.map(item => ({
      period: item._id,
      consumed: parseFloat((item.total_energy_wh / 1000).toFixed(2)), // Convert to kWh
      produced: parseFloat(item.total_water_volume.toFixed(2)),
      efficiency: item.total_energy_wh > 0 
        ? parseFloat((item.total_water_volume / (item.total_energy_wh / 1000)).toFixed(2)) / 100
        : 0,
      avgPower: parseFloat(item.avg_power?.toFixed(2) || '0'),
      maxPower: parseFloat(item.max_power?.toFixed(2) || '0'),
    }));
  },
  
  // Format combined data for all pumps
  formatCombinedPumpData: (data) => {
    if (!data || !data.pumpData) {
      return { chartData: [], summary: {} };
    }
    
    const pumpIds = Object.keys(data.pumpData);
    const allPeriods = new Set();
    
    // Collect all unique time periods
    pumpIds.forEach(pumpId => {
      data.pumpData[pumpId].forEach(record => {
        allPeriods.add(record.period);
      });
    });
    
    // Sort periods chronologically
    const sortedPeriods = Array.from(allPeriods).sort();
    
    // Create combined records for all periods
    const chartData = sortedPeriods.map(period => {
      const record = { period };
      let totalConsumed = 0;
      let totalProduced = 0;
      
      pumpIds.forEach(pumpId => {
        const pumpRecord = data.pumpData[pumpId].find(r => r.period === period);
        
        if (pumpRecord) {
          totalConsumed += pumpRecord.consumed || 0;
          totalProduced += pumpRecord.produced || 0;
        }
      });
      
      record.consumed = parseFloat(totalConsumed.toFixed(2));
      record.produced = parseFloat(totalProduced.toFixed(2));
      record.efficiency = totalConsumed > 0 
        ? parseFloat((totalProduced / totalConsumed / 100).toFixed(2))
        : 0;
        
      return record;
    });
    
    // Prepare summary data
    const summary = {
      totalConsumption: parseFloat((data.summary.total_energy_wh / 1000).toFixed(2)) || 0,
      totalProduction: parseFloat(data.summary.total_water_volume.toFixed(2)) || 0,
      efficiency: data.summary.total_energy_wh > 0
        ? parseFloat(((data.summary.total_water_volume / (data.summary.total_energy_wh / 1000)) * 100).toFixed(1))
        : 0,
      pumpCount: data.summary.pump_count?.length || 0
    };
    
    return { chartData, summary };
  },
  
  // Helper function to get date ranges based on time range
  getDateRange: (timeRange) => {
    const now = new Date();
    let start = new Date();
    
    switch(timeRange) {
      case 'day':
        // Start from beginning of today
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        // Start from 7 days ago
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        // Start from 30 days ago
        start.setDate(now.getDate() - 30);
        break;
      default:
        // Default to last 30 days
        start.setDate(now.getDate() - 30);
    }
    
    return {
      start: start.toISOString().split('T')[0], // YYYY-MM-DD format
      end: now.toISOString().split('T')[0]
    };
  },
  
  // Map dashboard timeRange to API interval
  getIntervalFromTimeRange: (timeRange) => {
    switch(timeRange) {
      case 'day': return 'hourly';
      case 'week': return 'daily';
      case 'month': return 'monthly';
      default: return 'monthly';
    }
  }
};