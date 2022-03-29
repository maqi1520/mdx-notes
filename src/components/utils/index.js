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
