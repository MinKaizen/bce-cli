'use strict'

export {}
const fetch = require('node-fetch')
const cryptoJs = require('crypto-js')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET

const timestamp = Date.now()
const method = 'GET'
const baseUrl = 'https://ftx.com'

const market = 'btc-perp'
const resolutionMinutes = 5
const resolutionSeconds = resolutionMinutes * 60
const startTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0, 0).getTime()/1000
// const endTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, resolutionMinutes, 0).getTime()/1000
const endTime = startTime

const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTime}&end_time=${endTime}`

const signaturePayload = `${timestamp}${method}${requestPath}`
const signature = cryptoJs.HmacSHA256(signaturePayload, apiSecret)
const signatureHex = signature.toString()

const headers = {
  "FTX-KEY": apiKey,
  "FTX-TS": timestamp,
  "FTX-SIGN": signatureHex,
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