'use strict'
export {}

const fs = require('fs')
const cryptoJs = require('crypto-js')
const fetch = require('node-fetch')

let helpers: any = {}

/**
 * Import a json file as an object
 * 
 * @param {string} path - path to a valid json file
 * @param {boolean} relativeToRoot - whether to automatically prepend ./ when searching for file
 */
const importJson = (path: string, relativeToRoot: Boolean = true): Object => {
  const missingDotSlash = relativeToRoot && !path.startsWith('./')
  const missingFileExtension = !path.endsWith('.json')
  let finalPath = path
  finalPath = missingDotSlash ? './' + finalPath : finalPath
  finalPath = missingFileExtension ? finalPath + '.json' : finalPath
  const raw = fs.readFileSync(finalPath)
  const parsed = JSON.parse(raw)
  return parsed
}
helpers.importJson = importJson

/**
 * Calculate Start time
 * @param {string} timeStringUTC - string representing the UTC time of day in 24 hour format. e.g. '10:00:00' = 10AM
 * @returns {Date} - The Date object representing today at the specified start time
 * 
 * Pre Conditions:
 * - timeStringUTC is a a valid 24 hour string in HH:mm:ss format
 */
const calculateStartTime = (timeStringUTC: string): Date => {
  const targetTime = new Date(`1970-01-01T${timeStringUTC}+00:00`)
  const targetHours = targetTime.getUTCHours()
  const targetMinutes = targetTime.getUTCMinutes()
  const targetSeconds = targetTime.getUTCSeconds()

  let startTime = new Date()
  startTime.setUTCHours(targetHours)
  startTime.setUTCMinutes(targetMinutes)
  startTime.setUTCSeconds(targetSeconds)
  startTime.setUTCMilliseconds(0)
  return startTime
}
helpers.calculateStartTime = calculateStartTime

/**
 * Calculate end time in seconds based on a start time, resolution in seconds and number of candles
 * 
 * @param {string} timeStringUTC - UTC time of day in 24 hour format. e.g. '10:00:00' = 10AM
 * @param {int} resolutionMinutes - Candle thickness in minutes
 * @param {int} numCandles - Number of candles to count
 * @returns {Date}
 */
const calculateEndTime = (timeStringUTC: string, resolutionMinutes: number, numCandles: number): Date => {
  const startTime = calculateStartTime(timeStringUTC)
  const resolutionMilliseconds = resolutionMinutes * 60 * 1000
  const offsetMilliseconds = (numCandles-1) * resolutionMilliseconds
  const endTime = new Date(startTime.getTime() + offsetMilliseconds)
  return endTime
}
helpers.calculateEndTime = calculateEndTime

/**
 * 
 * @param {string} apiSecret- API Secret
 * @param {int} timestamp - number of milliseconds since epoch
 * @param {string} method - http method. e.g. GET or POST
 * @param {string} requestPath - request path, including leading slash and any params. e.g. '/api/markets/btc?id=23'
 * @return {string} - SHA256 HMAC of the timestamp, method and requestPath as a hex string
 */
const ftxSign = (apiSecret: string, timestamp: number, method: string, requestPath: string): string => {
  const payload = timestamp.toString() + method + requestPath
  const signature = cryptoJs.HmacSHA256(payload, apiSecret)
  const signatureHex = signature.toString()
  return signatureHex
}
helpers.ftxSign = ftxSign

interface FTXFetchParams {
  market: string,
  resolution: number,
  startTime: string,
  numCandles: number,
}

const FTXFetch = async(fetchParams: FTXFetchParams, apiKey: string, apiSecret: string): Promise<Object> => {
  // Base URL
  const method = 'GET'
  const baseUrl = 'https://ftx.com'

  // GET Parameters
  const market = fetchParams.market
  const resolutionSeconds = fetchParams.resolution
  const startTime = calculateStartTime(fetchParams.startTime)
  const startTimeSeconds = startTime.getTime()/1000
  const endTime = calculateEndTime(fetchParams.startTime, resolutionSeconds, fetchParams.numCandles)
  const endTimeSeconds = endTime.getTime()/1000
  const requestPath = `/api/markets/${market}/candles?resolution=${resolutionSeconds}&start_time=${startTimeSeconds}&end_time=${endTimeSeconds}`
  const fullUrl = baseUrl + requestPath

  const timestamp = Date.now()
  const signature = helpers.ftxSign(apiSecret, timestamp, method, requestPath)

  const fetchOptions = {
    method: method,
    headers: {
      "FTX-KEY": apiKey,
      "FTX-TS": timestamp.toString(),
      "FTX-SIGN": signature,
    },
  }

  const response = await fetch(fullUrl, fetchOptions)
  const json = await response.json()
  const marketResult = {
    market: market,
    json: json,
  }
  return marketResult
}
helpers.FTXFetch = FTXFetch

// Default export
module.exports = helpers