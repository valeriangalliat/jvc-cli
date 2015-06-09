const Config = require('configstore')

export const denodeify = require('es6-denodeify')(Promise)

export const err = (message, props) =>
  Object.assign(new Error(message), { jvc: true }, props)

export const state = (persistent, id) => {
  const state = {}

  Object.defineProperty(state, 'set', {
    value: object => {
      Object.keys(state).forEach(key => delete state[key])
      Object.assign(state, object)
    }
  })

  if (persistent) {
    const config = new Config(id)
    Object.assign(state, config.all)
    Object.defineProperty(state, 'write', { value: () => config.all = state })
  } else {
    Object.defineProperty(state, 'write', { value: () => {} })
  }

  return state
}
