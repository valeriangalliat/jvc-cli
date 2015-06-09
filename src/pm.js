const { err } = require('./util')
const bindLate = require('bind-late')
const is = require('is')

// Find a thread or return null.
const maybeFindThread = (query, list) =>
  is.number(query)
    ? list[query]
    : Array.find(
        list.threads,
        t => t.subject.toLowerCase().indexOf(query) !== -1
      )

// Find a thread or exception.
const findThread = (...args) => {
  const thread = maybeFindThread(...args)
  if (thread) { return thread }
  throw err('Thread not found.')
}

export default ({ state, opts, ui, jvc }) => bindLate({
  list: async ({ page } = {}) => {
    const list = await jvc.pm.list({ page })
    state.pm = { list }
    state.write()

    console.log(ui.table(
      { head: ['R', 'ID', 'From', 'Subject', 'Date'] },
      list.threads.map((t, i) => [
        t.isRead ? 'Y' : 'N',
        i,
        t.author,
        t.subject,
        ui.date(t.date)
      ])
    ))
  },

  thread: async ({ id, offset }) => {
    const thread = await jvc.pm.thread({ id, offset })
    state.pm = Object.assign({}, state.pm, { thread })
    state.write()

    thread.messages.forEach(m => {
      console.log(ui.title(`${ui.chalk.bold(m.author)} ${ui.chalk.grey(ui.dateTime(m.date))}`))
      console.log()
      console.log(ui.post(m.post))
      console.log()
    })
  },

  pm: _ => async () => {
    if (!opts['<query>']) {
      return await _.list()
    }

    if (!state.pm) {
      throw err('No PM list to search.')
    }

    await _.thread({ id: findThread(opts['<query>'], state.pm.list).id })
  },

  next: _ => async () => {
    if (state.pm && state.pm.thread) {
      return await _.thread({
        id: state.pm.thread.id,
        offset: state.pm.thread.next
      })
    }

    if (state.pm && state.pm.list) {
      return await _.list({
        page: state.pm.list.page + 1
      })
    }

    throw err('Don\'t know what to do.')
  }
})
