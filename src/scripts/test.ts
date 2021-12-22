"use strict"

export {}

const dotenv = require("dotenv")
const BinanceClient = require("../modules/BinanceClient")
const { importJson } = require("../modules/helpers")
dotenv.config()

const apiKey = process.env.BINANCE_API_KEY
const apiSecret = process.env.BINANCE_API_SECRET
const options = importJson("/config/default.json")
const fetchParams = {
  resolutionMinutes: options.resolutionMinutes,
  startTimeUTC: options.startTimeUTC,
}
const client = new BinanceClient(apiKey, apiSecret, fetchParams)
const market = "ETHUSDT"
client.fetch(market).then((candle) => {
  console.log(candle)
})
