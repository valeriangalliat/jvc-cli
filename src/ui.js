const { denodeify } = require('./util')
const bindLate = require('bind-late')
const chalk = require('chalk')
const read = denodeify(require('read'))
const Table = require('cli-table')

export default bindLate({
  color: false,

  chalk: _ => _.color != null
    ? new chalk.constructor({ enabled: _.color })
    : chalk,

  chevron: '>>',

  greyParens: _ => text =>
    _.chalk.enabled
      ? text
          .replace('(', chalk.styles.grey.open + '(')
          .replace(')', ')' + chalk.styles.grey.close)
      : text,

  ask: _ => question =>
    `${_.chalk.green(_.chevron)} ${_.greyParens(question)}`
      + (_.chalk.enabled ? chalk.styles.cyan.open : ''),

  prompt: _ => opts =>
    read(Object.assign({}, opts, { prompt: _.ask(opts.prompt) })),

  error: _ => (...args) =>
    console.error(_.chalk.red(_.chevron), ...args),

  info: _ => (...args) =>
    console.log(_.chalk.blue(_.chevron), ...args),

  date: date =>
    date.toISOString()
      .substr(0, 10),

  time: date =>
    date.toISOString()
      .substr(11, 9),

  dateTime: date =>
    date.toISOString()
      .replace('T', ' ')
      .substr(0, 19),

  title: _ => title =>
    title + '\n'
      + _.chalk.gray(String.repeat('─', _.chalk.stripColor(title).length)),

  post: _ => post =>
    _.chalk.enabled
      ? post.replace(/:[\w\d]+:/g, _.chalk.yellow('$&'))
      : post,

  table: (opts, rows) => {
    const table = new Table(opts)
    table.push(...rows)
    return table.toString()
  },
})
