function isClassComponent(component) {
  return (
    typeof component === 'function' && !!component.prototype.isReactComponent
  )
}

function isFunctionComponent(component) {
  return (
    typeof component === 'function' &&
    String(component).includes('React.createElement')
  )
}

function isReactComponent(component) {
  return isClassComponent(component) || isFunctionComponent(component)
}

export function validateReactComponent(values) {
  return Object.values(values).every((value) => isReactComponent(value))
}

export function validateJavaScript(script) {
  return new Promise((resolve) => {
    const stringToEval = `throw new Error('Parsing successful!');function _hmm(){\n${script}\n}`
    const $script = document.createElement('script')
    $script.innerHTML = stringToEval

    window.addEventListener('error', function onError(errorEvent) {
      errorEvent.preventDefault()
      window.removeEventListener('error', onError)
      $script.parentNode.removeChild($script)
      if (errorEvent.message.indexOf('Parsing successful') !== -1) {
        resolve({ isValid: true })
        return
      }
      resolve({
        isValid: false,
        error: {
          line: errorEvent.lineno - 1,
          message: errorEvent.error.toString(),
        },
      })
    })
    document.body.appendChild($script)
  })
}
