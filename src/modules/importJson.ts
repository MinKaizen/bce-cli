'use strict'
export {}

const fs = require('fs')
const path = require('path')

const importJson = (path: String, relativeToRoot: Boolean = true): Object => {
  const missingDotSlash = relativeToRoot && !path.startsWith('./')
  const finalPath = missingDotSlash ? './' + path : path
  const raw = fs.readFileSync(finalPath)
  const parsed = JSON.parse(raw)
  return parsed
}

module.exports['importJson'] = importJson
module.exports = importJson