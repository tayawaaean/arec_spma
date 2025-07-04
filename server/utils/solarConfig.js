// Utility to parse system capacity (kW) from solarPanelConfig like "6x300W"
function parseSystemCapacity(solarPanelConfig) {
    const match = solarPanelConfig.match(/(\d+)x\s*(\d+)\s*W/i);
    if (!match) return null;
    const numPanels = parseInt(match[1], 10);
    const powerPerPanel = parseInt(match[2], 10);
    const totalWatts = numPanels * powerPerPanel;
    return totalWatts / 1000; // Convert to kW
  }
  
  module.exports = { parseSystemCapacity };