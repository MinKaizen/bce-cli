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

- Create a better folder structure. e.g. interfaces.ts is not really a module, is it?
- Use a helper function to convert generic options object to ClientOptions
- Add "Source" to header columns. Make it easy to add more header columns
- Use a ClientFacade or ClientInterface so that Binance and FTX clients use the same interface
- Add user friendly exception handling
- Update readme with better instructions on how to configure

Next steps in order of priority if possible:

1. get both of them automatically to feed into a google sheet each day
2. Pull historical data from Binance and FTX - going back as far as possible
