export function boolean(value) {
  return value === true || value === false
}

export function string(value) {
  return typeof value === 'string' || value instanceof String
}

export function number(value) {
  return typeof value === 'number' || value instanceof Number
}

export function error(value) {
  return value instanceof Error
}

export function func(value) {
  return typeof value === 'function'
}

export function array(value) {
  return Array.isArray(value)
}

export function stringArray(value) {
  return array(value) && value.every((elem) => string(elem))
}

export function typedArray(value, check) {
  return Array.isArray(value) && value.every(check)
}

export function objectLiteral(value) {
  // Strictly speaking class instances pass this check as well. Since the LSP
  // doesn't use classes we ignore this for now. If we do we need to add something
  // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
  return value !== null && typeof value === 'object'
}
