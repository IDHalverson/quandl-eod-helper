const fetcher = require("./util/fetcher");
const {
  gatherPricesListedByDate,
  gatherPricesListedByTicker,
  getDates,
  validateEodApiData,
  validateTickers,
  validateEndDate,
  validateStartDate
} = require("./util/parser");

class Eod {
  constructor(
    startDate = "2016-01-01",
    endDate = "2016-12-31",
    tickers = ["TEST"],
    eodApiData = [
      {
        dataset: {
          dataset_code: "TEST",
          data: [["2016-01-01", 1], ["2016-01-02", 2]]
        }
      }
    ]
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.tickers = tickers;
    this.eodApiData = eodApiData;

    this.parsedEodApiDate = {};
  }

  config(
    startDate = "2016-01-01",
    endDate = "2016-12-31",
    tickers = ["TEST"],
    eodApiData = [
      {
        dataset: {
          dataset_code: "TEST",
          data: [["2016-01-01", 1], ["2016-01-02", 2]]
        }
      }
    ]
  ) {
    this.startDate = validateStartDate(startDate);
    this.endDate = validateEndDate(endDate);
    this.tickers = validateTickers(tickers);
    this.eodApiData = validateEodApiData(eodApiData);
  }

  setDateRange(startDate, endDate) {
    this.startDate = validateStartDate(startDate);
    this.endDate = validateEndDate(endDate);
  }

  setStartDate(startDate) {
    this.startDate = validateStartDate(startDate);
  }

  setEndDate(endDate) {
    this.endDate = validateEndDate(endDate);
  }

  setTickers(tickers) {
    this.tickers = validateTickers(tickers);
  }

  fetch() {
    fetcher(this.startDate, this.endDate, this.tickers).then(data => {
      this.eodApiData = data;
      console.log(`Fetched ${data.length} stocks successfully!`);
    });
  }

  createDataObject() {
    const pricesByTicker = gatherPricesListedByTicker(this.eodApiData);
    const tickers = this.tickers;
    const dates = getDates(pricesByTicker, tickers);
    const pricesByDate = gatherPricesListedByDate(
      pricesByTicker,
      dates,
      tickers
    );

    this.parsedEodApiData = {
      dataTypes: ["tickers", "dates", "pricesByTicker", "pricesByDate"],
      tickers,
      dates,
      pricesByTicker,
      pricesByDate
    };
  }

  data() {
    this.createDataObject();
    return this.parsedEodApiData;
  }
}

module.exports = Eod;
