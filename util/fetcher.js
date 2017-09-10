require("dotenv").config();
const QUANDL_API_KEY = process.env.QUANDL_API_KEY;
const BASE_URL = "https://www.quandl.com/api/v3/datasets/EOD/";
require("isomorphic-fetch");
const { isLeapYear } = require("./parser");
const moment = require("moment");

const ensureFetch = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return await response.json();
};

const fetchData = async (year, tickers) => {
  try {
    const startDate = moment()
      .year(year)
      .dayOfYear(1)
      .startOf("day")
      .format()
      .split("T")[0];

    const endDate = moment()
      .year(year)
      .dayOfYear(isLeapYear(year) ? 366 : 365)
      .startOf("day")
      .format()
      .split("T")[0];

    const data = [];
    for (let ticker of tickers) {
      console.log("Fetching Stock: ", ticker);
      const params = `&column_index=4&start_date=${startDate}&end_date=${endDate}`;
      const url = `${BASE_URL}${ticker}.json?${params}&api_key=${QUANDL_API_KEY}`;
      data.push(await ensureFetch(url));
      console.log("Finished with: ", ticker);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = fetchData;
