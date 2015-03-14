export const denodeify = require('es6-denodeify')(Promise)

export const err = (message, props) =>
  Object.assign(new Error(message), { jvc: true }, props)
