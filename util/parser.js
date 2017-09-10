const moment = require("moment");

const isLeapYear = year => {
  year = Number(year);
  if (year % 100 === 0) {
    if (year % 400 === 0) {
      return true;
    }
    return false;
  }
  return year % 4 === 0;
};

const createDay = (day, year) => {
  return moment()
    .year(year)
    .dayOfYear(day)
    .startOf("day")
    .format()
    .split("T")[0];
};

const findFirstPriceOfYear = (prices, year) => {
  let dayOfYear = 1;
  while (!prices[createDay(dayOfYear, year)]) {
    dayOfYear++;
  }
  return prices[createDay(dayOfYear, year)];
};

const extractPricesIntoObject = ticker => {
  return ticker.dataset.data.reduce((pricesObject, [date, price]) => {
    pricesObject[date] = price;
    return pricesObject;
  }, {});
};

const gatherAndPopulatePrices = (ticker, year) => {
  const prices = extractPricesIntoObject(ticker);
  let lastKnownPrice = findFirstPriceOfYear(prices, year);
  console.log(lastKnownPrice);
  const lengthOfYear = isLeapYear(year) ? 366 : 365;
  let newPrices = {};
  [...Array(lengthOfYear)].forEach((_, dayOfYear) => {
    ++dayOfYear;
    if (prices[createDay(dayOfYear, year)]) {
      newPrices[createDay(dayOfYear, year)] =
        prices[createDay(dayOfYear, year)];
      lastKnownPrice = newPrices[createDay(dayOfYear, year)];
    } else {
      newPrices[createDay(dayOfYear, year)] = lastKnownPrice;
    }
  });
  return newPrices;
};

const gatherPricesListedByTicker = (stockData, year) => {
  let pricesByTicker = {};
  for (let ticker of stockData) {
    pricesByTicker[ticker.dataset.dataset_code] = gatherAndPopulatePrices(
      ticker,
      year
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

const validateYear = year => {
  if (typeof year !== "string") {
    throw new Error("Year must be a string in 'yyyy' format.");
  }
  if (!/[0-9]{4}/.test(Number(year))) {
    throw new Error("Year must be a string in 'yyyy' format.");
  }
  return year.toString();
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
const validateEodData = eodData => {
  if (!eodData) {
    throw new Error(
      "EodData could not be set. Did you enter in the correct format?"
    );
  }
  if (!eodData[0]) {
    throw new Error(
      "EodData could not be set. Did you enter in the correct format?"
    );
  }
  if (!eodData[0].dataset) {
    throw new Error(
      "EodData could not be set. Did you enter in the correct format?"
    );
  }
  if (!eodData[0].dataset.data || !Array.isArray(eodData[0].dataset.data)) {
    throw new Error(
      "EodData could not be set. Did you enter in the correct format?"
    );
  }
  return eodData;
};

module.exports = {
  gatherPricesListedByDate,
  gatherPricesListedByTicker,
  getDates,
  validateEodData,
  validateTickers,
  validateYear,
  isLeapYear
};
