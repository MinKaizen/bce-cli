'use strict'

export {}

const dotenv = require('dotenv')
const _ = require('lodash')
const helpers = require('../modules/helpers')

// Load environment variables
dotenv.config()

const params = helpers.importJson('params/default.json')

helpers.FTXFetch(params, process.env.API_KEY, process.env.API_SECRET)
  .then((response) => response.json())
  .then((json) => {
    console.log(json)
  })
  .catch(err => {
    console.error(err)
  })