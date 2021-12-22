"use strict"

export {}

const dotenv = require("dotenv")
const FTXClient = require("../modules/FTXClient")
const BinanceClient = require("../modules/BinanceClient")
const { importJson, candlesToCSV } = require("../modules/helpers")

// Load environment variables
dotenv.config()

const options = importJson("/config/default.json")

const ftxOptions = {
  resolutionMinutes: options.resolutionMinutes,
  startTimeUTC: options.startTimeUTC,
}
const ftx = new FTXClient(
  process.env.API_KEY,
  process.env.API_SECRET,
  ftxOptions
)
const binanceOptions = {
  resolutionMinutes: options.resolutionMinutes,
  startTimeUTC: options.startTimeUTC,
}
const binance = new BinanceClient(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET,
  binanceOptions
)

interface Candle {
  market: string
  open: number
  high: number
  low: number
  close: number
}

const clientMap = {
  binance: binance,
  ftx: ftx,
}

const candles: Array<Candle> = options.markets.map((clientMarket) => {
  const clientName = clientMarket.split(":")[0]
  const market = clientMarket.split(":")[1]
  const client = clientMap[clientName]
  return client.fetch(market)
})

Promise.all(candles).then((candles) => {
  const headers = ["market", "open", "high", "low", "close"]
  const csv = candlesToCSV(candles, headers)
  console.log(csv)
})
