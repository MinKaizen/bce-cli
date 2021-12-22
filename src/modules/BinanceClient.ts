"use strict"

export {}

const { Spot } = require("@binance/connector")
const helpers = require("../modules/helpers")

interface InterfaceOptions {
  resolutionMinutes: number
  startTimeUTC: string
}

interface VendorOptions {
  startTime: number
  endTime: number
  limit: number
}

class BinanceClient {
  options: InterfaceOptions
  client

  constructor(apiKey: string, apiSecret: string, options?: InterfaceOptions) {
    const defaultOptions = {
      resolutionMinutes: 5,
      startTimeUTC: "00:00:00",
    }
    this.options = Object.assign(defaultOptions, options ?? {})
    this.client = new Spot(apiKey, apiSecret)
  }

  async fetch(market: string) {
    const resolutionSeconds = this.options.resolutionMinutes * 60
    const startTime = helpers.calculateStartTime(this.options.startTimeUTC)
    const startTimeMilliseconds = startTime.getTime()
    const numCandles = 1
    const endTime = helpers.calculateEndTime(
      this.options.startTimeUTC,
      resolutionSeconds,
      numCandles
    )
    const endTimeMilliseconds = endTime.getTime()
    const interval = this.options.resolutionMinutes.toString() + "m"
    const options = {
      startTime: startTimeMilliseconds,
      endTime: endTimeMilliseconds,
      limit: numCandles,
    }
    const res = await this.client.klines(market, interval, options)
    const candle = await {
      market: market,
      open: res.data[0][1],
      high: res.data[0][2],
      low: res.data[0][3],
      close: res.data[0][4],
    }
    return candle
  }

  generateOptions() {}
}

module.exports = BinanceClient
