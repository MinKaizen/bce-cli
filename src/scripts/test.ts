'use strict'

export {}

const { Spot } = require('@binance/connector')
const helpers = require('../modules/helpers')

const apiKey = 'BOm2VlAF1ZV2y1TmzFqO3faCkGkVc7LAvaBue4crScmlDcBFWoepA8JdnHCLhOXb'
const apiSecret = 'NYp1UjgqgAyJ3YyZTYW6JUSDko6dQJMjUW0P32YM3ks96gwQdapaLJFI8MtyU77B'
const client = new Spot(apiKey, apiSecret)

const resolutionSeconds = 300
const fetchParams = {
  market: 'ETHUSDT',
  resolution: 300,
  startTime: '00:00:00',
  numCandles: 1,
}
const startTime = helpers.calculateStartTime(fetchParams.startTime)
const startTimeMilliseconds = startTime.getTime()
const endTime = helpers.calculateEndTime(fetchParams.startTime, resolutionSeconds, fetchParams.numCandles)
const endTimeMilliseconds = endTime.getTime()
const interval = '5m'
const options = {
  startTime: startTimeMilliseconds,
  endTime: endTimeMilliseconds,
  limit: fetchParams.numCandles,
}

client.klines(fetchParams.market, interval, options)
  .then(console.log)
  .catch(e => {
    console.error(e.response.data)
  }) 

  // [
  //   [
  //     1499040000000,      // Open time
  //     "0.01634790",       // Open
  //     "0.80000000",       // High
  //     "0.01575800",       // Low
  //     "0.01577100",       // Close
  //     "148976.11427815",  // Volume
  //     1499644799999,      // Close time
  //     "2434.19055334",    // Quote asset volume
  //     308,                // Number of trades
  //     "1756.87402397",    // Taker buy base asset volume
  //     "28.46694368",      // Taker buy quote asset volume
  //     "17928899.62484339" // Ignore.
  //   ]
  // ]

// 22 Oct
// market: "BTCUSDT",
// open: '62193.15000000',
// high: '62450.01000000',
// low: '62125.09000000',
// close: '62447.78000000',

// 22 Oct
// market: 'ETHUSDT'
// open: '4053.00000000',
// high: '4089.00000000',
// low: '4051.31000000',
// close: '4087.08000000',

// 22 Oct
// market: 'SOLUSDT'
// open: '190.46000000',
// high: '191.95000000',
// low: '189.54000000',
// close: '191.72000000',