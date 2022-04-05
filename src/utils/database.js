import fetch from 'node-fetch'

export function put(item) {
  return new Promise((resolve, reject) => {
    fetch(process.env.TW_API_URL + '/api/playgrounds/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        uuid: item.ID,
        version: item.version,
        html: item.html,
        css: item.css,
        config: item.config,
      }),
    })
      .then((response) => {
        if (!response.ok) throw response
        return response.json()
      })
      .then(({ uuid }) => {
        resolve({
          ID: uuid,
          version: item.version,
          html: item.html,
          css: item.css,
          config: item.config,
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function get(Key) {
  return new Promise((resolve, reject) => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share?id=' + Key.ID, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        resolve({
          Item: { ...data, ID: data._id },
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function getTemplates(data) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    return response.json()
  })
}
