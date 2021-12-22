"use strict"

export {}

const dotenv = require("dotenv")
const FTXClient = require("../modules/FTXClient")
const { importJson } = require("../modules/helpers")
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
).then((results) => {
  console.log(FTXResultsToCSV(results))
})
