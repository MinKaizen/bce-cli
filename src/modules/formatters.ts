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
