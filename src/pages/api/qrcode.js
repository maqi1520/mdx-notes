// from https://github.com/turkyden/wechat-link/blob/main/api/index.ts
import QRCode from 'qrcode'

/**
 * Main
 */
export default async (request, response) => {
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
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="110" viewBox="0 0 100% 110" fill="none">
    <style>
      .header {
        font: 500 14px 'Segoe UI', Ubuntu, Sans-Serif;
        fill: #374151;
        animation: fadeInAnimation 0.8s ease-in-out forwards;
      }
      .stat {
        font: 400 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      }
      .stagger {
        opacity: 0;
        animation: fadeInAnimation 0.3s ease-in-out forwards;
      }
      .light {
        fill: #6B7280;
        font-weight: 300
      }
      /* Animations */
      @keyframes scaleInAnimation {
        from {
          transform: translate(-5px, 5px) scale(0);
        }
        to {
          transform: translate(-5px, 5px) scale(1);
        }
      }
      @keyframes fadeInAnimation {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    </style>
    <rect class="stagger" style="animation-delay: 900ms" data-testid="card-bg" x="0.5" y="0.5" rx="2" height="90%" stroke="#E5E7EB" width="99%" fill="#fffefe" stroke-opacity="1" />
    <g data-testid="main-card-body" transform="translate(-6, 0)">
      <g transform="translate(0, 6)">
        <g transform="translate(0, 35)">
          <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)">>
            <text x="0" y="0" class="header" data-testid="header">${limitStr(
              text,
              12
            )}</text>
          </g>
        </g>
        <g transform="translate(0, 45)">
          <g class="stagger" style="animation-delay: 600ms" transform="translate(25, 0)">
            <svg class="light" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
            </svg>
            <text class="stat light" x="20" y="12.5">${limitStr(url, 32)}</text>
          </g>
        </g>
      </g>
      <g transform="translate(230, 18)" >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="64" height="64">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" x="0" y="0">
            <a href="${url}" target="_blank">
              <circle class="stagger" style="animation-delay: 300ms" r="128" cx="64" cy="64" stroke-width="1" stroke="" fill="url(#SvgjsPattern4297)">
                <title>${text}</title>
              </circle>
            </a>
          </svg>
          <defs>
            <pattern x="0" y="0" width="128" height="128" patternUnits="userSpaceOnUse" id="SvgjsPattern4297">
              <image width="64" height="64" href="${await generateQR(
                url
              )}"></image>
            </pattern>
          </defs>
        </svg>
      </g>
    </g>
  </svg>
  `
}

export const generateSVG1 = async ({ url }) => {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="148" height="148">
        <image width="148" height="148" href="${await generateQR(url)}"></image>
        </svg>
  `
}
