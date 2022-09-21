import fetch from 'node-fetch'

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
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    return response.json()
  })
}
