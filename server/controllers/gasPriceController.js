const axios = require('axios');

const getCountryPrice = async (url, country) => {
  const response = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      'authorization': `apikey ${process.env.COLLECTAPI_KEY}`
    }
  });
  if (!response.data.results) {
    throw new Error('Invalid response from upstream API.');
  }
  return response.data.results.find(
    item => item.country.toLowerCase() === country.toLowerCase()
  );
};

exports.getPhilippinesDieselPrice = async (req, res, next) => {
  try {
    const price = await getCountryPrice('https://api.collectapi.com/gasPrice/otherCountriesDiesel', 'Philippines');
    if (!price) {
      return res.status(404).json({ message: 'Philippines diesel price not found.' });
    }
    res.json(price);
  } catch (err) {
    next(err);
  }
};

exports.getPhilippinesGasolinePrice = async (req, res, next) => {
  try {
    const price = await getCountryPrice('https://api.collectapi.com/gasPrice/otherCountriesGasoline', 'Philippines');
    if (!price) {
      return res.status(404).json({ message: 'Philippines gasoline price not found.' });
    }
    res.json(price);
  } catch (err) {
    next(err);
  }
};