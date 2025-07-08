// MQTT settings simulator to avoid CORS issues
let mqttSettings = {
    brokerUrl: "mqtt://broker.example.com:1883",
    username: "********", // Masked for security
    password: "********", // Masked for security
    isDefault: true
  };
  
  // Current admin password (for verification)
  // In a real app, this would be verified on the server
  const adminPassword = "admin123";
  
  export const getMqttSettings = async () => {
    return { ...mqttSettings };
  };
  
  export const updateMqttSettings = async (brokerUrl, username, password, adminPasswordVerify) => {
    // Verify superadmin password
    if (adminPasswordVerify !== adminPassword) {
      throw new Error("Invalid administrator password");
    }
    
    // Update MQTT settings
    mqttSettings = {
      brokerUrl,
      username: "********", // Always mask in response
      password: "********", // Always mask in response
      isDefault: false
    };
    
    return { 
      success: true, 
      message: "MQTT credentials and broker URL updated and client reconnected" 
    };
  };
  
  export const resetToDefaultMqttSettings = async (adminPasswordVerify) => {
    // Verify superadmin password
    if (adminPasswordVerify !== adminPassword) {
      throw new Error("Invalid administrator password");
    }
    
    // Reset to default settings
    mqttSettings = {
      brokerUrl: "mqtt://broker.example.com:1883",
      username: "********", // Masked for security
      password: "********", // Masked for security
      isDefault: true
    };
    
    return { 
      success: true, 
      message: "MQTT credentials reset to default values and client reconnected" 
    };
  };