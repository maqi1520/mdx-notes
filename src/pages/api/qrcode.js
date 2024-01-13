// from https://github.com/turkyden/wechat-link/blob/main/api/index.ts
import QRCode from 'qrcode'

/**
 * Main
 */
const handle = async (request, response) => {
  const {
    text = '长按识别二维码查看原文',
    url = 'https://www.baidu.com',
    type,
  } = request.query

  try {
    if (type === 'image') {
      const svg = await generateSVG1({ text, url })
      response.setHeader('Content-Type', 'image/svg+xml;charset=UTF-8')
      response.status(200).send(svg)
      return
    }
    const svg = await generateSVG({ text, url })
    response.setHeader('Content-Type', 'image/svg+xml;charset=UTF-8')
    response.status(200).send(svg)
  } catch (error) {
    response.status(200).send(error.message)
  }
}

export default handle

/**
 * Generate the QRCode with str
 * @param str
 * @returns
 */
export const generateQR = async (str) => {
  try {
    return await QRCode.toDataURL(str)
  } catch (err) {
    console.error(err)
  }
}

/**
 * limit the str character
 * @param str
 * @param num
 * @returns
 */
export const limitStr = (str, num) => {
  return str.slice(0, num) + (str.length > num ? '...' : '')
}

/**
 * Generate SVG with data
 * @param param0
 * @returns
 */
export const generateSVG = async ({ text, url }) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="100" viewBox="0 0 320 100" >
    <g  transform="translate(0, 0)">
    <rect x="0" y="0" height="100" stroke="#E5E7EB" width="320" fill="#fffefe"  />
      <g transform="translate(0, 6)">
        <g transform="translate(0, 35)">
          <g class="stagger"  transform="translate(25, 0)">>
            <text fill="#374151" x="0" y="0" >${limitStr(text, 12)}</text>
          </g>
        </g>
        <g transform="translate(0, 45)">
          <g transform="translate(25, 0)"> 
            <svg  width="16" height="16" fill="none" stroke="#6B7280" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            <text fill="#6B7280" class="stat light" x="20" y="12.5">${limitStr(
              url,
              32
            )}</text>
          </g>
        </g>
      </g>
      <g transform="translate(230, 13)" >
      <image width="74" height="74" href="${await generateQR(url)}"></image>
      </g>
    </g>
  </svg>`
}

export const generateSVG1 = async ({ url }) => {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="148" height="148">
        <image width="148" height="148" href="${await generateQR(url)}"></image>
        </svg>
  `
}
