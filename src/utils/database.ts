import fetch from 'node-fetch'

export function get<T>(id: string) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share?id=' + id, {
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    return response.json()
  }) as Promise<T>
}

export function getTemplates<T>(data: any) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/api/share', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => {
    return response.json()
  }) as Promise<T>
}
