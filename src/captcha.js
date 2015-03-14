const bindLate = require('bind-late')
const fs = require('fs')
const open = require('open')
const pipe = require('promisepipe')
const request = require('request')
const temp = require('temp')

export default bindLate({
  temp: () => temp.path({ suffix: '.png' }),
  download: (url, dest) => pipe(request(url), fs.createWriteStream(dest)),

  open,
  ui: require('./ui'),

  handle: _ => async err => {
    if (!err.captcha) {
      throw err
    }

    _.ui.info('Downloading captcha...')
    const file = _.temp()
    await _.download(err.captcha, file)
    _.open(file)

    return await _.ui.prompt({ prompt: 'Captcha:' })
      .then(code => err.retry(code).then(null, _.handle))
  }
})
