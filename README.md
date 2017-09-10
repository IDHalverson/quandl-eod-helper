
#Quandl EOD API Helper

This module assists in extracting certain time-series stock data
from the Quandl API using `database_code` EOD (End of Day).

Consult the Quandl time-series API Docs for information on the API:
`https://docs.quandl.com/docs/time-series`

This module parses response data into the following format. Future
versions may support other schemas and/or file types.

Format:
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

Directions for getting started:

1. Install the following dependencies:

- isomorphic-fetch:
`npm install isomorphic-fetch`

- dot-env:
`npm install dot-env`

- moment:
`npm install moment`

2. Place your Quandl api key in a `.env` file.

`QUANDL_API_KEY=YOUR_KEY`

3. Require the module to instantiate a new `Eod` instance.

`const Eod = require('quandl-eod-api-helper')`

4. Configure the `Eod` instance to your preferences.

All parameters are optional and will provide minimal default values if
passed no value or `undefined`.
```
const startDate = '2016-01-01'
// yyyy-mm-dd format
const endDate = '2016-01-06'
// yyyy-mm-dd format
const tickers = ['AAPL', 'MSFT']
// array of tickers... check the Quandl Docs for available options.
const eodApiData = {}
// option to input your own API response data if you do not want to use
// this module's native 'fetch' method.

Eod.config(startDate, endDate, tickers)
// example of the config method...
// note we are not passing in the optional eodApiData parameter
```

You can also configure parameters one at a time...

```
Eod.setStartDate(startDate)
Eod.setEndDate(endDate)
Eod.setDateRange(startDate, endDate)
Eod.setTickers(tickers)
Eod.setEodApiData(eodApiData)
```

5. Fetch the data from Quandl.

Data is stored within the `Eod` instance.
`Eod.fetch()`

6. Your data should now be available for use!

Example response from our configurations:
```
console.log(Eod.fetch())
```
or
```
console.log(Eod.parsedEodApiData)
```
Both should return:
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
    "1451883600",
    "1451970000",
    "1452056400"
    ],
  pricesByTicker: {
    AAPL: {
      1451883600: 105.35,
      1451970000: 102.71,
      1452056400: 100.7
      },
    MSFT: {
      1451883600: 54.8,
      1451970000: 55.05,
      1452056400: 54.05
    }
  },
  pricesByDate: {
    1451883600: {
      AAPL: 105.35,
      MSFT: 54.8
      },
    1451970000: {
      AAPL: 102.71,
      MSFT: 55.05
      },
    1452056400: {
      AAPL: 100.7,
      MSFT: 54.05
      }
  }
}
```
