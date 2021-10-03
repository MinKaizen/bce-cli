'use strict'

export {}
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const _ = require('lodash')
const helpers = require('../modules/helpers')

// Load environment variables
dotenv.config()

const params = helpers.importJson('params/default.json')

// Base URL
const method = 'GET'
const baseUrl = 'https://ftx.com'

// GET Parameters
const market = params.market
const resolutionSeconds = params.resolution
const startTime = helpers.calculateStartTime(params.startTime)
const startTimeSeconds = startTime.getTime()/1000
const startTimeFormatted = startTime.toLocaleString('en-AU')
const endTime = helpers.calculateEndTime(params.startTime, resolutionSeconds, params.numCandles)
const endTimeSeconds = endTime.getTime()/1000
const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTimeSeconds}&end_time=${endTimeSeconds}`

const timestamp = Date.now()
const signature = helpers.ftxSign(process.env.API_SECRET, timestamp, method, requestPath)

const headers = {
  "FTX-KEY": process.env.API_KEY,
  "FTX-TS": timestamp,
  "FTX-SIGN": signature,
  "FTX-SUBACCOUNT": process.env.SUB_ACCOUNT,
}

const fullUrl = baseUrl + requestPath

fetch(fullUrl, {
  method: method,
  headers: headers,
})
  .then((response) => response.json())
  .then((json) => {
    const candle = json.result[0]
    const row = {
      market: market,
      time: startTimeFormatted,
      resolution: (params.resolution / 60).toString() + ' min',
      low: candle.low,
      high: candle.high,
    }
    console.log(row)
  })
  .catch(err => {
    console.error(err)
  })