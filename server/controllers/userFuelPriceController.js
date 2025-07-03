const UserFuelPrice = require('../models/UserFuelPrice');
const axios = require('axios');

async function fetchPhFuelPrice(fuelType) {
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

// GET the user's prices, or fetch from API if not set
exports.getMyFuelPrices = async (req, res, next) => {
  try {
    let priceDoc = await UserFuelPrice.findOne({ user: req.user._id });
    if (!priceDoc || priceDoc.gasolinePrice == null || priceDoc.dieselPrice == null) {
      // No custom prices, fetch default from API
      const [dieselUsd, gasolineUsd, usdToPhp] = await Promise.all([
        fetchPhFuelPrice('diesel'),
        fetchPhFuelPrice('gasoline'),
        fetchUsdToPhpRate()
      ]);
      const defaultPrices = {
        gasolinePrice: +(gasolineUsd * usdToPhp).toFixed(3),
        dieselPrice: +(dieselUsd * usdToPhp).toFixed(3)
      };
      // If no doc, create one, else update null fields
      if (!priceDoc) {
        priceDoc = await UserFuelPrice.create({ user: req.user._id, ...defaultPrices });
      } else {
        if (priceDoc.gasolinePrice == null) priceDoc.gasolinePrice = defaultPrices.gasolinePrice;
        if (priceDoc.dieselPrice == null) priceDoc.dieselPrice = defaultPrices.dieselPrice;
        await priceDoc.save();
      }
    }
    res.json({
      gasolinePrice: priceDoc.gasolinePrice,
      dieselPrice: priceDoc.dieselPrice
    });
  } catch (err) {
    next(err);
  }
};

// PUT - update user's gasoline and/or diesel price (in PHP)
exports.updateMyFuelPrices = async (req, res, next) => {
  try {
    const { gasolinePrice, dieselPrice } = req.body;
    if (
      (gasolinePrice != null && (typeof gasolinePrice !== 'number' || gasolinePrice <= 0)) ||
      (dieselPrice != null && (typeof dieselPrice !== 'number' || dieselPrice <= 0))
    ) {
      return res.status(400).json({ message: 'Prices must be positive numbers.' });
    }
    let priceDoc = await UserFuelPrice.findOne({ user: req.user._id });
    if (!priceDoc) {
      priceDoc = await UserFuelPrice.create({ user: req.user._id, gasolinePrice, dieselPrice });
    } else {
      if (gasolinePrice != null) priceDoc.gasolinePrice = gasolinePrice;
      if (dieselPrice != null) priceDoc.dieselPrice = dieselPrice;
      await priceDoc.save();
    }
    res.json({
      gasolinePrice: priceDoc.gasolinePrice,
      dieselPrice: priceDoc.dieselPrice
    });
  } catch (err) {
    next(err);
  }
};

// PUT - reset user's prices to latest API value (default)
exports.resetMyFuelPrices = async (req, res, next) => {
  try {
    const [dieselUsd, gasolineUsd, usdToPhp] = await Promise.all([
      fetchPhFuelPrice('diesel'),
      fetchPhFuelPrice('gasoline'),
      fetchUsdToPhpRate()
    ]);
    const defaultPrices = {
      gasolinePrice: +(gasolineUsd * usdToPhp).toFixed(3),
      dieselPrice: +(dieselUsd * usdToPhp).toFixed(3)
    };
    let priceDoc = await UserFuelPrice.findOneAndUpdate(
      { user: req.user._id },
      defaultPrices,
      { new: true, upsert: true }
    );
    res.json({
      gasolinePrice: priceDoc.gasolinePrice,
      dieselPrice: priceDoc.dieselPrice
    });
  } catch (err) {
    next(err);
  }
};