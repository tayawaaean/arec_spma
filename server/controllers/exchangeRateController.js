const axios = require('axios');

exports.getUsdToPhpRate = async (req, res, next) => {
  try {
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
      return res.json({ USD_PHP: response.data.conversion_rates.PHP });
    } else {
      return res.status(502).json({ message: 'Could not retrieve USD to PHP rate.' });
    }
  } catch (err) {
    next(err);
  }
};