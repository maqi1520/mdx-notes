export function getTheme() {
  return document.querySelector('html').classList.contains('dark')
    ? 'dark'
    : 'light'
}

export function onDidChangeTheme(callback) {
  const root = document.querySelector('html')

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        if (root.classList.contains('dark')) {
          callback('dark')
        } else {
          callback('light')
        }
      }
    }
  })

  observer.observe(root, { attributes: true })

  return () => {
    observer.disconnect()
  }
}

export function toggleTheme() {
  const root = document.querySelector('html')
  root.classList.add('disable-transitions')
  if (root.classList.contains('dark')) {
    root.classList.remove('dark')
    try {
      window.localStorage.setItem('theme', 'light')
    } catch (_) {}
  } else {
    root.classList.add('dark')
    try {
      window.localStorage.setItem('theme', 'dark')
    } catch (_) {}
  }
  window.setTimeout(() => {
    root.classList.remove('disable-transitions')
  }, 0)
}
