export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const postData = async ({ url, data }: { url: string; data?: {} }) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  const token = localStorage.getItem('token')
  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(process?.env?.NEXT_PUBLIC_SITE_API_URL + url, {
    method: 'POST',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.log('Error in postData', { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}