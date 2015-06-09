const { err, state } = require('./util')
const pkg = require('./package')

const bindLate = require('bind-late')
const { docopt } = require('docopt')
const jvc = require('jvc')

const doc = `
Usage:
  jvc login [<user>]
  jvc logout
  jvc pm [<query>]
  jvc next

Options:
  -h, --help     Show help.
  -V, --version  Show version.
  --color        Force color output.
`.trim()

export default bindLate({
  persistent: true,
  state: _ => state(_.persistent, pkg.name),
  opts: _ => docopt(doc, { argv: _.argv, version: pkg.version }),

  ui: _ => require('./ui').override({ color: _.opts['--color'] || null }),
  captcha: _ => require('./captcha').override({ ui: _.ui }),
  jvc: _ => jvc.override(_.state.jvc),

  user: _ => require('./user')({
    state: _.state,
    opts: _.opts,
    ui: _.ui,
    handleCaptcha: _.captcha.handle,
    jvc: _.jvc
  }),

  pm: _ => require('./pm')({
    state: _.state,
    opts: _.opts,
    ui: _.ui,
    jvc: _.jvc
  }),

  commands: {
    logout: _ => _.user.logout,
    login: _ => _.user.login,
    pm: _ => _.pm.pm,

    next: _ => async opts => {
      if (_.state.pm) {
        return await _.pm.next(opts)
      }

      throw err('Don\'t know what to do.')
    }
  },

  // Invoke current command (need fullfilled options).
  run: _ => () =>
    _.commands[Array.find(Object.keys(_.commands), c => _.opts[c])](),

  // Override `argv` then run.
  main: _ => argv =>
    _.override({ argv }).run(),

  // Main with error handling.
  mainError: _ => argv =>
    _.main(argv)
      .then(null, err => {
        _.ui.error(!err.jvc && err.stack || err.message)
        process.exit(1)
      })
})
