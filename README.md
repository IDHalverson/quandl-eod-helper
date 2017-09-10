
#Quandl EOD Helper

This module assists in extracting certain time-series stock data
from the Quandl API using `database_code` EOD (End of Day).

Consult the Quandl time-series API Docs for information on the API:
`https://docs.quandl.com/docs/time-series`

This module parses response data into the following format. Future
versions may support other schemas and/or file types. It also parses the data
such that weekends and holidays will be populated with the stock price data from
the last day from which data is available.

Format (full example is shown at bottom of README):
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

**Install the following dependencies:**

- isomorphic-fetch, dot-env, moment:
```
npm install isomorphic-fetch
npm install dot-env
npm install moment
```

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
````
...yyyy string format

```
const tickers = ['AAPL', 'MSFT']
````
...as an array of tickers... check the Quandl Docs for available options.
```
const eodData = {}
```
...an option to input your own API response data if you do not want to use
this module's native 'fetch' method.

```
Eod.config(year, tickers)
```
```
const Eod = new quandleEodHelper(year, tickers)
```
...example of configuration using the constructor or the `config()` method.
Note: we are not passing in the optional eodData parameter.


You can also configure parameters one at a time...

```
Eod.setYear(year)
Eod.setTickers(tickers)
Eod.setEodData(eodData)
```

**Fetch the data from Quandl.**

Data is stored within the `Eod` instance.
```
Eod.fetch()
```

**Your data should now be available for use, using the Eod.data() method!**

Note: If you configured your own Quandl API data, you can use Eod.data() now (skip the previous 'fetch' step) to parse that data.

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
