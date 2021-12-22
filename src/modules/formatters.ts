"use strict"
export {}

const formatters: any = {}

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

const FTXResultsToCSV = (
  results: Array<FTXResult>,
  columns: Array<string> = ["market", "open", "high", "low", "close"]
) => {
  const headerString = columns.join(",")
  const bodyString = results
    .map((result) => {
      return columns
        .map((column) => {
          return result[column]
        })
        .join(",")
    })
    .join("\n")

  const csv = [headerString, bodyString].join("\n")
  return csv
}
formatters.FTXResultsToCSV = FTXResultsToCSV

module.exports = formatters
