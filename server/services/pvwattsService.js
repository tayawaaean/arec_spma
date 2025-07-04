const axios = require('axios');

const API_KEY = process.env.NREL_API_KEY;

async function getPvWattsEstimate({lat, lon, system_capacity, tilt = 18, azimuth = 180, array_type = 1, module_type = 0, losses = 14}) {
  if (!API_KEY) throw new Error('NREL API key is not set');
  const url = 'https://developer.nrel.gov/api/pvwatts/v8.json';
  const params = {
    api_key: API_KEY,
    lat,
    lon,
    system_capacity,
    tilt,
    azimuth,
    array_type,
    module_type,
    losses
  };
  const { data } = await axios.get(url, { params });
  return data;
}

module.exports = { getPvWattsEstimate };