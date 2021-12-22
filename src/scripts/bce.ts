"use strict"

export {}

const dotenv = require("dotenv")
const FTXClient = require("../modules/FTXClient")
const { importJson, candleToCSV } = require("../modules/helpers")
const { FTXResultsToCSV } = require("../modules/formatters")

// Load environment variables
dotenv.config()

const options = importJson("/config/default.json")

var ftx = new FTXClient(process.env.API_KEY, process.env.API_SECRET, options)
const markets = ["btc-perp", "eth-perp", "sol-perp", "ftm-perp"]

Promise.all(
  markets.map((market) => {
    return ftx.fetch(market)
  })
)
  .then((candles) => {
    const headers = ["market", "open", "high", "low", "close"]
    const rows = candles.map((candle) => {
      return candleToCSV(candle, headers)
    })
    const csv = [headers.join(","), ...rows].join("\n")
    return csv
  })
  .then((csv) => {
    console.log(csv)
    // console.log(FTXResultsToCSV(results))
  })
