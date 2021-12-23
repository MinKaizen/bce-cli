'use strict'
import { Candle, ClientOptions } from './interfaces'
import { calculateStartTime } from './helpers'
import { Spot } from '@binance/connector'

interface BinanceOptions {
  startTime: number
  endTime: number
  limit: number
}

export default class BinanceClient {
  options: ClientOptions
  client: any

  constructor(apiKey: string, apiSecret: string, options?: ClientOptions) {
    const defaultOptions = {
      resolutionMinutes: 5,
      startTimeUTC: '00:00:00',
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

  makeOptions(ClientOptions: ClientOptions): BinanceOptions {
    const startTime = calculateStartTime(ClientOptions.startTimeUTC)
    const startTimeMilliseconds = startTime.getTime()
    const endTimeMilliseconds =
      startTimeMilliseconds + ClientOptions.resolutionMinutes * 60 * 1000
    const options = {
      startTime: startTimeMilliseconds,
      endTime: endTimeMilliseconds,
      limit: 1,
    }
    return options
  }

  makeInterval(resolutionMinutes: number) {
    return resolutionMinutes.toString() + 'm'
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
