'use strict'
export {}

const fs = require('fs')
const cryptoJs = require('crypto-js')

let helpers: any = {}

/**
 * Import a json file as an object
 * 
 * Pre Conditions:
 * - path is a string
 * - path points to a valid json file
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
 * Calculate Start time in seconds since epoch given a 24 hour time string
 * @param timeStringUTC - string representing the UTC time of day in 24 hour format. e.g. '10:00:00' = 10AM
 * @returns @number - The start time in seconds since epoch
 * 
 * Pre Conditions:
 * - timeStringUTC is a a valid 24 hour string in HH:mm:ss format
 */
const calculateStartTime = (timeStringUTC: String): number => {
  const targetTime = new Date(`1970-01-01T${timeStringUTC}+00:00`)
  const targetHours = targetTime.getUTCHours()
  const targetMinutes = targetTime.getUTCMinutes()
  const targetSeconds = targetTime.getUTCSeconds()

  let startTime = new Date()
  startTime.setUTCHours(targetHours)
  startTime.setUTCMinutes(targetMinutes)
  startTime.setUTCSeconds(targetSeconds)
  startTime.setUTCMilliseconds(0)
  const startTimeSeconds = startTime.getTime()/1000
  return startTimeSeconds
}
helpers.calculateStartTime = calculateStartTime

/**
 * Calculate end time in seconds based on a start time, resolution in seconds and number of candles
 * 
 * Pre Conditions:
 * - startTime is a positive integer representing the seconds since epoch
 * - startTime is less than Date.now()
 * - resolutionSeconds is a positive integer representing the candle size in seconds
 * - numCandles is a positive integer greater than 0 representing the number of candles to retrieve
 * - The sum of startTime + numCandles * resolution is less than Date.now()
 */
const calculateEndTime = (startTime: number, resolutionSeconds: number, numCandles: number): number => {
  return startTime + (numCandles - 1) * resolutionSeconds
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