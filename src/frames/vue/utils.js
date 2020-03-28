const path = require('path')

exports.absolute = relative => path.resolve(process.cwd(), `${relative}`)
