## Requirements

1. [Node (and NPM)](https://nodejs.org/en/download/) or [Node Version Manager](https://github.com/nvm-sh/nvm)

## Quickstart

1. `cd <directory to this project>`
2. `npm run bce`

## Config

These are the default settings (see params/default.json)

- Number of candles per market: 1
- Candle size: 5 minutes
- Start Time of candle: UTC 00:00:00
- Markets: btc-perp. eth-perp, sol-perp, ftm-perp
- Exchange: FTX

What's configurable (right now):

- Add a new market, remove markets, change their order
- Change the candle size (on a per-market basis)
- Change the start time of candle (on a per-market basis)


## TODO

- Refactor config/default.json to include general config, but allow options to be overridden on a per-client (FTX/BCE) and per-market basis
- Update readme with better instructions on how to configure
- Add user friendly exception handling to FTXClient.fetch()

Next steps in order of priority if possible:
1. Implement Binance version from test.ts
2. get both of them automatically to feed into a google sheet each day
3. Pull historical data from Binance and FTX - going back as far as possible