"use strict"

export {}

const { Spot } = require("@binance/connector")
const helpers = require("../modules/helpers")

const apiKey =
  "BOm2VlAF1ZV2y1TmzFqO3faCkGkVc7LAvaBue4crScmlDcBFWoepA8JdnHCLhOXb"
const apiSecret =
  "NYp1UjgqgAyJ3YyZTYW6JUSDko6dQJMjUW0P32YM3ks96gwQdapaLJFI8MtyU77B"
const client = new Spot(apiKey, apiSecret)

const resolutionSeconds = 300
const fetchParams = {
  market: "ETHUSDT",
  resolution: 300,
  startTime: "00:00:00",
  numCandles: 1,
}
const startTime = helpers.calculateStartTime(fetchParams.startTime)
const startTimeMilliseconds = startTime.getTime()
const endTime = helpers.calculateEndTime(
  fetchParams.startTime,
  resolutionSeconds,
  fetchParams.numCandles
)
const endTimeMilliseconds = endTime.getTime()
const interval = "5m"
const options = {
  startTime: startTimeMilliseconds,
  endTime: endTimeMilliseconds,
  limit: fetchParams.numCandles,
}

client
  .klines(fetchParams.market, interval, options)
  .then(console.log)
  .catch((e) => {
    console.error(e.response.data)
  })
