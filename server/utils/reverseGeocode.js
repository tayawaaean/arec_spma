const axios = require('axios');

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'solar-pump-app/1.0 (admin@yourdomain.com)' }
  });
  const address = response.data.address || {};

  return {
    barangay: address.suburb || address.neighbourhood || '',
    municipality: address.city || address.town || address.village || '',
    region: address.state || address.region || '',
    country: address.country || ''
  };
}

module.exports = reverseGeocode;