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

interface Candle {
  market: string
  open: number
  high: number
  low: number
  close: number
}

class BinanceClient {
  options: InterfaceOptions
  client: any

  constructor(apiKey: string, apiSecret: string, options?: InterfaceOptions) {
    const defaultOptions = {
      resolutionMinutes: 5,
      startTimeUTC: "00:00:00",
    }
    this.options = Object.assign(defaultOptions, options ?? {})
    this.client = new Spot(apiKey, apiSecret)
  }

  async fetch(market: string): Promise<Candle> {
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

  makeCandle(market: string, response: any): Candle {
    const candle = {
      market: market,
      open: parseFloat(response.data[0][1]),
      high: parseFloat(response.data[0][2]),
      low: parseFloat(response.data[0][3]),
      close: parseFloat(response.data[0][4]),
    }
    return candle
  }
}

module.exports = BinanceClient