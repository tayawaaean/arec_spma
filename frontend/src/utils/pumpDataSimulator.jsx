/**
 * Generates simulated pump data for testing
 */
export const generatePumpData = (pumpId, interval, startDate, endDate) => {
    const result = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get time interval in milliseconds
    let timeStep;
    switch(interval) {
      case 'hourly':
        timeStep = 60 * 60 * 1000; // 1 hour
        break;
      case 'daily':
        timeStep = 24 * 60 * 60 * 1000; // 1 day
        break;
      case 'weekly':
        timeStep = 7 * 24 * 60 * 60 * 1000; // 1 week
        break;
      case 'monthly':
        timeStep = 30 * 24 * 60 * 60 * 1000; // ~1 month (simplified)
        break;
      default:
        timeStep = 24 * 60 * 60 * 1000; // default to daily
    }
    
    // Generate base patterns based on pump ID (to create variety)
    const baseVoltage = 48 + (pumpId * 2); // Different base voltages
    const baseCurrent = 5 + (pumpId * 0.5); // Different base currents
    const baseFlow = 20 + (pumpId * 3); // Different base flow rates
    
    // Seed for "randomness" but consistent across rerenders
    const seed = pumpId * 1000;
    
    // Generate data points
    let time = new Date(start);
    let dayCount = 0;
    let cumulativeEnergy = 0;
    let cumulativeWater = 0;
    
    while (time <= end) {
      // Create time factors for realistic fluctuations
      const hourOfDay = time.getHours();
      const dayFactor = Math.sin((dayCount * Math.PI) / 15) * 0.2 + 0.8; // Smooth fluctuations over days
      
      // Simulate sunlight pattern (higher during day, lower at night)
      const sunlightFactor = hourOfDay >= 6 && hourOfDay <= 18 
        ? Math.sin((hourOfDay - 6) * Math.PI / 12) // Peak at noon
        : 0.1; // Minimal at night
      
      // Get pseudorandom value seeded by timestamp and pumpId
      const pseudoRandom = (timestamp, offset = 0) => {
        const value = Math.sin(timestamp * 0.0001 + seed + offset) * 0.5 + 0.5;
        return value;
      };
      
      // Calculate metrics with realistic patterns
      const timeValue = time.getTime();
      const randomFactor = pseudoRandom(timeValue);
      
      // Voltage varies with sunlight and has some random fluctuations
      const voltage = baseVoltage * (sunlightFactor * 0.8 + 0.2) * (0.95 + randomFactor * 0.1);
      
      // Current depends on voltage and load
      const current = baseCurrent * sunlightFactor * dayFactor * (0.9 + pseudoRandom(timeValue, 100) * 0.2);
      
      // Power is voltage * current
      const power = voltage * current;
      
      // Flow rate depends on power with some inefficiency factor
      const flowFactor = (power > 50) ? (0.8 + pseudoRandom(timeValue, 200) * 0.2) : 0.1;
      const flow = baseFlow * flowFactor * sunlightFactor;
      
      // Energy is cumulative
      const energyIncrement = power * (timeStep / (60 * 60 * 1000)); // Convert to watt-hours
      cumulativeEnergy += energyIncrement;
      
      // Water volume is cumulative
      const waterIncrement = flow * (timeStep / (60 * 1000)); // Convert to liters (assuming flow is L/min)
      cumulativeWater += waterIncrement;
      
      // Add data point
      result.push({
        timestamp: time.toISOString(),
        voltage: parseFloat(voltage.toFixed(2)),
        current: parseFloat(current.toFixed(2)),
        power: parseFloat(power.toFixed(2)),
        flow: parseFloat(flow.toFixed(2)),
        energy: parseFloat(cumulativeEnergy.toFixed(2)),
        water_volume: parseFloat(cumulativeWater.toFixed(2))
      });
      
      // Move to next time step
      time = new Date(time.getTime() + timeStep);
      dayCount++;
    }
    
    return result;
  };