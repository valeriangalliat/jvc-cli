export default ({ state, opts, ui, handleCaptcha, jvc }) => ({
  logout: async () => {
    state.set({})
    state.write()
  },

  login: async () => {
    const user = opts['<user>'] || await ui.prompt({ prompt: 'User:' })

    const pass = await ui.prompt({
      prompt: 'Pass (will not echo):',
      silent: true,
    })

    const connectedJvc = await jvc.login({ user, pass })
      .then(null, handleCaptcha)

    state.jvc = {
      user: { user, cookie: connectedJvc.user.cookie },
    }

    state.write()
  },
})
