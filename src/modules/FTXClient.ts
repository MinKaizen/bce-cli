'use strict'
export {}

const cryptoJs = require('crypto-js')
const fetch = require('node-fetch')
const helpers = require('../modules/helpers')

interface FTXResult {
  market: string
  startTime: string
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface FTXOptions {
  resolutionMinutes: number
  startTimeUTC: string
}

class FTXClient {

  apiKey: string
  apiSecret: string
  options: FTXOptions

  constructor(apiKey: string, apiSecret: string, options: FTXOptions) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.options = options
  }

  async fetch (market: string): Promise<FTXResult> {
    const method = 'GET'
    const baseURL = 'https://ftx.com'
    const requestPath = this.generateRequestPath(market, this.options.startTimeUTC, this.options.resolutionMinutes)
    const fullURL =  baseURL + requestPath
    const headers = this.generateHeaders(requestPath, method)

    const response = await fetch(fullURL, {method: method, headers: headers})
    const json = await response.json()

    if (typeof json.error === 'string') {
      throw json.error
    }

    const result = {...{market: market}, ...json.result[0]}
    return result
  }

  generateRequestPath(market: string, startTimeUTC: string, resolutionMinutes: number): string {
    const resolutionSeconds = resolutionMinutes * 60
    const startTimeSeconds = helpers.calculateStartTime(startTimeUTC).getTime()/1000
    const endTimeSeconds = helpers.calculateEndTime(startTimeUTC, resolutionSeconds, 1).getTime()/1000
    const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTimeSeconds}&end_time=${endTimeSeconds}`
    return requestPath
  }

  generateHeaders(requestPath: string, method: string): object {
    const timestamp = Date.now()
    const signature = this.sign(this.apiSecret, timestamp, method, requestPath)
    const headers = {
      "FTX-KEY": this.apiKey,
      "FTX-TS": timestamp.toString(),
      "FTX-SIGN": signature,
    }
    return headers
  }

  sign(apiSecret: string, timestamp: number, method: string, requestPath: string): string {
    const payload = timestamp.toString() + method + requestPath
    const signature = cryptoJs.HmacSHA256(payload, apiSecret)
    const signatureHex = signature.toString()
    return signatureHex
  }

}

module.exports = FTXClient