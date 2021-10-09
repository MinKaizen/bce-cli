## TODO

- Decouple the formatting functionality away from FTXFetch function
- Refactor param/default.json to include general config and a "markets" or "query" or "candles" array. General config should include things like resolution, but allow for it to be overridden per market
- Add a proper readme file
- Add exception handling to FTXFetch
- Add a formatter that spits out TSV (tab separated, so we can paste it straight into excel)
- Include open and close in formatted results