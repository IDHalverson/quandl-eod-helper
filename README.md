
# Quandl EOD Helper

See it on [NPM](https://www.npmjs.com/package/quandl-eod-helper)

Fetch, extract and parse time-series stock data from the [Quandl](https://www.quandl.com/) API (only `database_code` EOD supported). It also fills the data
such that weekends and holidays will be populated with the stock price data from
the last day from which data is available. Future
versions may support different schemas, file types, and/or database_codes.

Consult the Quandl time-series [API Docs](https://docs.quandl.com/docs/time-series)
 for information on the API.

Output Format (full example is shown at bottom of README):
```
{
  dataTypes: [...],
  tickers: [ticker1, ticker2, ...],
  dates: [date1, date2, ...],
  pricesByTicker: {
    ticker1: {
      date1: price,
      date2: price
    }
    ticker2: {
      date1: price,
      date2: price
    }
  }
  pricesByDate: {
    date1: {
      ticker1: price,
      ticker2: price
    }
    date2: {
      ticker1: price,
      ticker2: price
    }
  }
}
```

# Installation

```
npm install --save quandl-eod-helper
```

**quandl-eod-helper has the following npm dependencies:**

`isomorphic-fetch`, `dot-env`, `moment`

# Setup and Configuration

**Place your Quandl api key in a `.env` file.**

root/.env
```
QUANDL_API_KEY=YOUR_KEY
```

**Require the module, and instantiate a new `Eod` instance.**

```
const quandlEodHelper = require('quandl-eod-helper')
const Eod = new quandlEodHelper()
```

**Configure the `Eod` instance to your preferences.**

All configurations are optional and will provide minimal default values; however,
the helper will throw an error if you attempt to parse (using Eod.data()) without
either passing in properly formatted data or fetching first.

```
const year = '2016'
const tickers = ['AAPL', 'MSFT']
const eodData = {} //<--very optional
```
`year` as 'yyyy' string format
`tickers` as an array of tickers... check the Quandl Docs for available options.
`eodData` is an option to input your own API response data if you do not want to use
this module's native 'fetch' method. Ensure it's in the same JSON format that Quandl returns.

```
Eod.config({ year, tickers })
const Eod = new quandleEodHelper({ year, tickers })
```
...example of configuration using **either** the constructor or the `config()` method.
Note: we are not passing in the optional eodData parameter.


You can also configure parameters one at a time...

```
Eod.setYear(year)
Eod.setTickers(tickers)
Eod.setEodData(eodData)
```

# Usage

**Fetch the data from Quandl.**

When fetching, data is stored within the `Eod` instance.
```
Eod.fetch()
```

**Your data should now be available for use, using the `Eod.data()` method!**

Note: If you configured your own Quandl API data, you can use Eod.data() now (skip the previous 'fetch' step) to just parse that data.

Example response from our configurations:
```
const data = Eod.data()
console.log(data)
```
result:
```
{
  dataTypes: [
    "tickers",
    "dates",
    "pricesByTicker",
    "pricesByDate"
    ],
  tickers: [
    "AAPL",
    "MSFT"
    ],
  dates: [
    "2016-01-01",
    "2016-01-02",
    "2016-01-03",
    etc...
    ],
  pricesByTicker: {
    AAPL: {
      2016-01-01: 105.35,
      2016-01-02: 102.71,
      2016-01-03: 100.7,
      etc...
      },
    MSFT: {
      2016-01-01: 54.8,
      2016-01-02: 55.05,
      2016-01-03: 54.05,
      etc...
    }
  },
  pricesByDate: {
    2016-01-01: {
      AAPL: 105.35,
      MSFT: 54.8,
      },
    2016-01-02: {
      AAPL: 102.71,
      MSFT: 55.05
      },
    2016-01-03: {
      AAPL: 100.7,
      MSFT: 54.05
      },
    etc...
  }
}
```
