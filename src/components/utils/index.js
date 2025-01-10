export const download = (filename, code) => {
  // 下载的文件名
  var file = new File([code], filename, {
    type: 'text/markdown',
  })
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  // 下载内容转变成blob地址
  eleLink.href = URL.createObjectURL(file)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

export const copyHtml = (text) => {
  // 获取 input
  let input = document.getElementById('copy-input')
  if (!input) {
    // input 不能用 CSS 隐藏，必须在页面内存在。
    input = document.createElement('input')
    input.id = 'copy-input'
    input.style.position = 'absolute'
    input.style.left = '-1000px'
    input.style.zIndex = '-1000'
    document.body.appendChild(input)
  }
  // 让 input 选中一个字符，无所谓那个字符
  input.value = 'NOTHING'
  input.setSelectionRange(0, 1)
  input.focus()

  // 复制触发
  document.addEventListener('copy', function copyCall(e) {
    e.preventDefault()
    e.clipboardData.setData('text/html', text)
    e.clipboardData.setData('text/plain', text)
    document.removeEventListener('copy', copyCall)
  })
  document.execCommand('copy')
}

export function toDataURL(src, outputFormat, quality = 1.0) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { alpha: true })

      // 设置 canvas 尺寸为原图的 2 倍
      const scale = 2
      canvas.height = img.height * scale
      canvas.width = img.width * scale

      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // 直接绘制放大后的图片，不使用 ctx.scale()
        ctx.drawImage(
          img,
          0,
          0,
          img.width * scale, // 目标宽度
          img.height * scale // 目标高度
        )
      }

      const dataURL = canvas.toDataURL(outputFormat || 'image/png', quality)
      resolve(dataURL)
    }
    img.src = src
  })
}
