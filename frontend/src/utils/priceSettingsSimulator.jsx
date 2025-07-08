// Price settings simulator to avoid CORS issues
let priceSettings = {
    gasolinePrice: 65.50, // in PHP per liter
    dieselPrice: 55.75,   // in PHP per liter
    electricityPrice: 9.35 // in PHP per kWh
  };
  
  export const getPriceSettings = async () => {
    return { ...priceSettings };
  };
  
  export const updatePriceSettings = async (newPrices) => {
    // Update price settings
    priceSettings = {
      ...priceSettings,
      ...newPrices
    };
    
    return { 
      success: true, 
      message: "Price settings updated successfully",
      data: { ...priceSettings }
    };
  };