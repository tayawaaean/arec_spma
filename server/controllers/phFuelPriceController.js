const axios = require('axios');

async function fetchPhFuelPrice(fuelType) {
  // fuelType: 'diesel' or 'gasoline'
  const url = fuelType === 'diesel'
    ? 'https://api.collectapi.com/gasPrice/otherCountriesDiesel'
    : 'https://api.collectapi.com/gasPrice/otherCountriesGasoline';

  const response = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      'authorization': `apikey ${process.env.COLLECTAPI_KEY}`
    }
  });

  const philippines = response.data.results.find(
    (item) => item.country.toLowerCase() === 'philippines'
  );
  if (!philippines) throw new Error('Philippines price not found.');
  return parseFloat(philippines.price);
}

async function fetchUsdToPhpRate() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  );
  if (
    response.data &&
    response.data.result === 'success' &&
    response.data.conversion_rates &&
    response.data.conversion_rates.PHP
  ) {
    return response.data.conversion_rates.PHP;
  }
  throw new Error('Could not retrieve USD to PHP rate.');
}

exports.getPhilippinesFuelPricesInPhp = async (req, res, next) => {
  try {
    // In parallel for speed
    const [dieselUsd, gasolineUsd, usdToPhp] = await Promise.all([
      fetchPhFuelPrice('diesel'),
      fetchPhFuelPrice('gasoline'),
      fetchUsdToPhpRate()
    ]);
    res.json({
      diesel: {
        usd: dieselUsd,
        php: +(dieselUsd * usdToPhp).toFixed(3)
      },
      gasoline: {
        usd: gasolineUsd,
        php: +(gasolineUsd * usdToPhp).toFixed(3)
      },
      exchange_rate: usdToPhp
    });
  } catch (err) {
    next(err);
  }
};