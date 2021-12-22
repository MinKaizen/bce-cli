"use strict"

export interface Candle {
  market: string
  open: number
  high: number
  low: number
  close: number
}

export interface ClientOptions {
  resolutionMinutes: number
  startTimeUTC: string
}
