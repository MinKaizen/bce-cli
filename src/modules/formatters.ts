'use strict'
export {}

interface MarketResult {
  market: string;
  json: Result;
}

interface Result {
  success: boolean;
  result: Array<Candle>
}

interface Candle {
  startTime: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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

const FTXResultsToCSV = (results: Array<FTXResult>, columns: Array<string> = ['market', 'open', 'high', 'low', 'close']) => {
  const headerString = columns.join(',')
  const bodyString = results.map(result => {
    return columns.map(column => {
      return result[column]
    }).join(',')
  }).join('\n')

  const csv = [headerString, bodyString].join('\n')
  return csv
}
formatters.FTXResultsToCSV = FTXResultsToCSV

const marketResultsToCSV = (marketResults: Array<MarketResult>, columns: Array<string> = ['open', 'high', 'low', 'close']): string => {
  const headerString: string = ["market", ...columns].join(",")
  const rows = marketResults.map((marketResult: MarketResult) => {
    const candle = marketResult.json.result[0]
    let row = [marketResult.market]
    columns.forEach(column => {
      row.push(candle[column])
    })
    const rowString: string = row.join(",")
    return rowString
  })
  const csv = [headerString, ...rows].join("\n")
  return csv
}
formatters.marketResultsToCSV = marketResultsToCSV


module.exports = formatters
