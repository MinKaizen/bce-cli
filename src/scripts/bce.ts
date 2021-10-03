'use strict'

export {}

const dotenv = require('dotenv')
const _ = require('lodash')
const helpers = require('../modules/helpers')

// Load environment variables
dotenv.config()

const params = helpers.importJson('params/default.json');

Promise.all(params.map(async market => {
  const response = await helpers.FTXFetch(market, process.env.API_KEY, process.env.API_SECRET)
  return response
}))
  .then(results => {
    results.forEach(result => {
      console.log(result)
    })
  })