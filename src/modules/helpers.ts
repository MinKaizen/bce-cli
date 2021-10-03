'use strict'
export {}

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

module.exports['calculateEndTime'] = calculateEndTime