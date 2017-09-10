const moment = require("moment");

const createLinuxDay = day => {
  return moment()
    .year(2016)
    .dayOfYear(day)
    .startOf("day")
    .unix();
};

const findFirstPriceOfYear = prices => {
  let dayOfYear = 1;
  while (!prices[createLinuxDay(dayOfYear++)])
    return prices[createLinuxDay(dayOfYear)];
};

const extractPricesIntoObject = ticker => {
  return ticker.dataset.data.reduce((pricesObject, [date, price]) => {
    pricesObject[moment(date).unix()] = price;
    return pricesObject;
  }, {});
};

const gatherAndPopulatePrices = ticker => {
  const prices = extractPricesIntoObject(ticker);
  let lastKnownPrice = findFirstPriceOfYear(prices);
  const lengthOfYear = 365 + 1;
  Array(lengthOfYear).forEach((_, dayOfYear) => {
    ++dayOfYear;
    prices[createLinuxDay(dayOfYear)] =
      prices[createLinuxDay(dayOfYear)] || lastKnownPrice;
  });
  return prices;
};

const gatherPricesListedByTicker = stockData => {
  let pricesByTicker = {};
  for (let ticker of stockData) {
    pricesByTicker[ticker.dataset.dataset_code] = gatherAndPopulatePrices(
      ticker
    );
  }
  return pricesByTicker;
};

const getDates = (pricesByTicker, tickers) => {
  return Object.keys(pricesByTicker[tickers[0]]);
};

const gatherPricesListedByDate = (pricesByTicker, dates, tickers) => {
  let pricesByDate = {};
  dates.forEach(date => {
    pricesByDate[date] = {};
    tickers.forEach(ticker => {
      pricesByDate[date][ticker] = pricesByTicker[ticker][date];
    });
  });
  return pricesByDate;
};

const validateStartDate = startDate => {
  if (typeof startDate !== "string") {
    throw new Error("Dates must be a string in 'yyyy-mm-dd' format.");
  }
  if (
    !/[0-9]{4}/.test(Number(startDate.slice(0, 4))) ||
    !/[0-9]{1}/.test(Number(startDate.slice(5, 6))) ||
    !/[0-9]{1}/.test(Number(startDate.slice(6, 7))) ||
    !/[0-9]{1}/.test(Number(startDate.slice(8, 9))) ||
    !/[0-9]{1}/.test(Number(startDate.slice(9, 10)))
  ) {
    throw new Error("Dates must be a string in 'yyyy-mm-dd' format.");
  }
  return startDate;
};
const validateEndDate = endDate => {
  if (typeof endDate !== "string") {
    throw new Error("Dates must be a string in 'yyyy-mm-dd' format.");
  }
  if (
    !/[0-9]{4}/.test(Number(endDate.slice(0, 4))) ||
    !/[0-9]{1}/.test(Number(endDate.slice(5, 6))) ||
    !/[0-9]{1}/.test(Number(endDate.slice(6, 7))) ||
    !/[0-9]{1}/.test(Number(endDate.slice(8, 9))) ||
    !/[0-9]{1}/.test(Number(endDate.slice(9, 10)))
  ) {
    throw new Error("Dates must be a string in 'yyyy-mm-dd' format.");
  }
  return endDate;
};
const validateTickers = tickers => {
  if (!Array.isArray(tickers)) {
    throw new Error(
      "Entites could not be set. Did you enter an array of strings?"
    );
  }
  if (!tickers || !tickers.length) {
    throw new Error(
      "Entites could not be set. Did you enter an array of strings?"
    );
  }
  if (typeof tickers[0] !== "string") {
    throw new Error(
      "Entites could not be set. Did you enter an array of strings?"
    );
  }
  return tickers;
};
const validateEodApiData = eodApiData => {
  if (!eodApiData) {
    throw new Error(
      "EodApiData could not be set. Did you enter in the correct format?"
    );
  }
  if (!eodApiData[0]) {
    throw new Error(
      "EodApiData could not be set. Did you enter in the correct format?"
    );
  }
  if (!eodApiData[0].dataset) {
    throw new Error(
      "EodApiData could not be set. Did you enter in the correct format?"
    );
  }
  if (
    !eodApiData[0].dataset.data ||
    !Array.isArray(eodApiData[0].dataset.data)
  ) {
    throw new Error(
      "EodApiData could not be set. Did you enter in the correct format?"
    );
  }
  return eodApiData;
};

module.exports = {
  gatherPricesListedByDate,
  gatherPricesListedByTicker,
  getDates,
  validateEodApiData,
  validateTickers,
  validateEndDate,
  validateStartDate
};
