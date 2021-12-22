"use strict"

export {}

const { Spot } = require("@binance/connector")
const { calculateStartTime } = require("../modules/helpers")

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
    const interval = this.makeInterval(this.options.resolutionMinutes)
    const options = this.makeOptions(this.options)
    const res = await this.client.klines(market, interval, options)
    const candle = this.makeCandle(market, res)
    return candle
  }

  makeOptions(interfaceOptions: InterfaceOptions): VendorOptions {
    const startTime = calculateStartTime(interfaceOptions.startTimeUTC)
    const startTimeMilliseconds = startTime.getTime()
    const endTimeMilliseconds =
      startTimeMilliseconds + interfaceOptions.resolutionMinutes * 60 * 1000
    const options = {
      startTime: startTimeMilliseconds,
      endTime: endTimeMilliseconds,
      limit: 1,
    }
    return options
  }

  makeInterval(resolutionMinutes: number) {
    return resolutionMinutes.toString() + "m"
  }

  makeCandle(market: string, response) {
    const candle = {
      market: market,
      open: response.data[0][1],
      high: response.data[0][2],
      low: response.data[0][3],
      close: response.data[0][4],
    }
    return candle
  }
}

module.exports = BinanceClient
