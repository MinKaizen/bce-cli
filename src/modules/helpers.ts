'use strict'
export {}

const fs = require('fs')
const cryptoJs = require('crypto-js')

let helpers: any = {}

/**
 * Import a json file as an object
 * 
 * @param {string} path - path to a valid json file
 * @param {boolean} relativeToRoot - whether to automatically prepend ./ when searching for file
 */
const importJson = (path: String, relativeToRoot: Boolean = true): Object => {
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
const calculateStartTime = (timeStringUTC: String): Date => {
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
const calculateEndTime = (timeStringUTC: String, resolutionMinutes: number, numCandles: number): Date => {
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
const ftxSign = (apiSecret: String, timestamp: number, method: String, requestPath: String): String => {
  const payload = timestamp.toString() + method + requestPath
  const signature = cryptoJs.HmacSHA256(payload, apiSecret)
  const signatureHex = signature.toString()
  return signatureHex
}
helpers.ftxSign = ftxSign

// Default export
module.exports = helpers