// Environmental Impact Calculations

function environmentalImpact(kWh) {
    // Conversion factors (typical values, update to local standards if needed)
    const co2_factor = 0.7; // kg CO2 per kWh (Philippines grid average)
    const tree_factor = 21.77; // kg CO2/year per tree (US EPA)
    const coal_factor = 2; // kWh per kg coal burned
    const diesel_factor = 3.6; // kWh per liter diesel
    const gasoline_factor = 8.9; // kWh per gallon gasoline (EPA), 1 gal = 3.785 L
    const gasoline_factor_L = gasoline_factor / 3.785; // kWh per liter gasoline
    const mj_per_kwh = 3.6; // 1 kWh = 3.6 MJ
  
    const co2_kg = kWh * co2_factor;
    const trees_equivalent = co2_kg / tree_factor;
    const coal_kg = kWh / coal_factor;
    const diesel_liters = kWh / diesel_factor;
    const gasoline_liters = kWh / gasoline_factor_L;
    const energy_saved_MJ = kWh * mj_per_kwh;
  
    return {
      co2_kg,
      trees_equivalent,
      coal_kg,
      diesel_liters,
      gasoline_liters,
      energy_saved_MJ
    };
  }
  
  module.exports = { environmentalImpact };