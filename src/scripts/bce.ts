'use strict'
import { Candle, ClientOptions } from '../modules/interfaces'
import dotenv from 'dotenv'
import FTXClient from '../modules/FTXClient'
import BinanceClient from '../modules/BinanceClient'
import { importJson, candlesToCSV } from '../modules/helpers'

// Load environment variables
dotenv.config()
const options: any = importJson('/config/default.json')

if (!process.env.API_KEY) {
  throw 'API_KEY is undefined in .env'
}
if (!process.env.API_SECRET) {
  throw 'API_SECRET is undefined in .env'
}
if (!process.env.BINANCE_API_KEY) {
  throw 'BINANCE_API_KEY is undefined in .env'
}
if (!process.env.BINANCE_API_SECRET) {
  throw 'BINANCE_API_SECRET is undefined in .env'
}
if (typeof options.resolutionMinutes !== 'number') {
  throw 'resolutionMinutes is not defined in config file'
}
if (typeof options.startTimeUTC !== 'string') {
  throw 'startTimeUTC is not defined in config file'
}

const clientOptions: ClientOptions = {
  resolutionMinutes: options.resolutionMinutes,
  startTimeUTC: options.startTimeUTC,
}

const ftx = new FTXClient(
  process.env.API_KEY,
  process.env.API_SECRET,
  clientOptions
)
const binance = new BinanceClient(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET,
  clientOptions
)

const clientMap = {
  binance: binance,
  ftx: ftx,
}

const candles: Array<Candle> = options.markets.map(clientMarket => {
  const clientName = clientMarket.split(':')[0]
  const market = clientMarket.split(':')[1]
  const client = clientMap[clientName]
  return client.fetch(market)
})

Promise.all(candles).then(candles => {
  const headers = ['market', 'open', 'high', 'low', 'close']
  const csv = candlesToCSV(candles, headers)
  console.log(csv)
})
