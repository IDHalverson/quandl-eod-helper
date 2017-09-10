const fetcher = require("./util/fetcher");
const {
  gatherPricesListedByDate,
  gatherPricesListedByTicker,
  getDates,
  validateEodData,
  validateTickers,
  validateYear
} = require("./util/parser");

class Eod {
  constructor(
    {
      year = "2016",
      tickers = ["AAPL"],
      eodData = [
        {
          dataset: {
            dataset_code: "AAPL",
            data: [["2016-01-01", 1], ["2016-01-02", 2]]
          }
        }
      ]
    } = {
      year: "2016",
      tickers: ["AAPL"],
      eodData: [
        {
          dataset: {
            dataset_code: "AAPL",
            data: [["2016-01-01", 1], ["2016-01-02", 2]]
          }
        }
      ]
    }
  ) {
    this.year = year;
    this.tickers = tickers;
    this.eodData = eodData;

    this.parsedEodApiDate = false;
  }

  config(
    {
      year = "2016",
      tickers = ["AAPL"],
      eodData = [
        {
          dataset: {
            dataset_code: "AAPL",
            data: [["2016-01-01", 1], ["2016-01-02", 2]]
          }
        }
      ]
    } = {
      year: "2016",
      tickers: ["AAPL"],
      eodData: [
        {
          dataset: {
            dataset_code: "AAPL",
            data: [["2016-01-01", 1], ["2016-01-02", 2]]
          }
        }
      ]
    }
  ) {
    this.year = year;
    this.tickers = validateTickers(tickers);
    this.eodData = validateEodData(eodData);
  }

  setYear(year) {
    this.year = validateYear(year);
  }

  setTickers(tickers) {
    this.tickers = validateTickers(tickers);
  }

  fetch() {
    fetcher(this.year, this.tickers).then(data => {
      this.eodData = data;
      console.log(`Fetched ${data.length} stocks successfully!`);
    });
  }

  createDataObject() {
    const pricesByTicker = gatherPricesListedByTicker(this.eodData, this.year);
    const tickers = this.tickers;
    const dates = getDates(pricesByTicker, tickers);
    const pricesByDate = gatherPricesListedByDate(
      pricesByTicker,
      dates,
      tickers
    );

    this.parsedEodData = {
      dataTypes: ["tickers", "dates", "pricesByTicker", "pricesByDate"],
      tickers,
      dates,
      pricesByTicker,
      pricesByDate
    };
  }

  data() {
    this.createDataObject();
    return this.parsedEodData;
  }
}

module.exports = Eod;
