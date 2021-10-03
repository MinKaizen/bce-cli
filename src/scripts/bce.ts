'use strict'

export {}
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const {importJson, calculateStartTimeSeconds, calculateEndTime, ftxSign} = require('../modules/helpers')

// Load environment variables
dotenv.config()

const params = importJson('params/default.json')

// Base URL
const method = 'GET'
const baseUrl = 'https://ftx.com'

// GET Parameters
const market = params.market
const resolutionSeconds = params.resolution
const startTime = calculateStartTimeSeconds(params.startTime)
const endTime = calculateEndTime(startTime, resolutionSeconds, params.numCandles)
const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTime}&end_time=${endTime}`

const timestamp = Date.now()
const signature = ftxSign(process.env.API_SECRET, timestamp, method, requestPath)

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
  .then((json) => console.log(json))
  .catch(err => {
    console.error(err)
  })