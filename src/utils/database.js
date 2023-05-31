export function get(id) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share?id=' + id, {
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    return response.json()
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
