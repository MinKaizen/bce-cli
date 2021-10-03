'use strict'

export {}
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const {importJson, calculateStartTime, calculateEndTime, ftxSign} = require('../modules/helpers')

// Load environment variables
dotenv.config()

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const params = importJson('params/default.json')

const timestamp = Date.now()
const method = 'GET'
const baseUrl = 'https://ftx.com'

const market = params.market
const resolutionSeconds = params.resolution
const startTime = calculateStartTime(params.startTime)
const endTime = calculateEndTime(startTime, resolutionSeconds, params.numCandles)

const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTime}&end_time=${endTime}`
const signature = ftxSign(apiSecret, timestamp, method, requestPath)

const headers = {
  "FTX-KEY": apiKey,
  "FTX-TS": timestamp,
  "FTX-SIGN": signature,
  "FTX-SUBACCOUNT": "Scalper",
}

// console.log(signaturePayload)
// console.log(signature)
// console.log(signatureHex)
// console.log(headers)

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