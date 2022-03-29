import * as Babel from '@babel/standalone'

let current

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event) => {
  if (event.data._current) {
    current = event.data._current
    return
  }

  function respond(data) {
    setTimeout(() => {
      if (event.data._id === current) {
        postMessage({ _id: event.data._id, ...data })
      } else {
        postMessage({ _id: event.data._id, canceled: true })
      }
    }, 0)
  }

  try {
    let res = Babel.transform(event.data.config, { presets: ['react'] })
    respond(res)
  } catch (error) {
    respond({
      error: {
        message: error,
        file: 'Config',
      },
    })
  }
})
