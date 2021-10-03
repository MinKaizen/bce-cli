'use strict'
export {}

const fs = require('fs')

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

// Default export
module.exports = helpers