import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

/**
 * getOrCreateModel is a helper function that will return a model if it exists
 * or create a new model if it does not exist.
 * This is useful for when you want to create a model for a file that may or may not exist yet.
 * @param value The value of the model
 * @param language The language of the model
 * @param path The path of the model
 * @returns The model that was found or created
 */
export function getOrCreateModel(
  value: string,
  language: string,
  path: string
) {
  return getModel(path) || createModel(value, language, path)
}

/**
 * getModel is a helper function that will return a model if it exists
 * or return undefined if it does not exist.
 * @param path The path of the model
 * @returns The model that was found or undefined
 */
function getModel(path: string) {
  return monaco.editor.getModel(createModelUri(path))
}

/**
 * createModel is a helper function that will create a new model
 * @param value The value of the model
 * @param language The language of the model
 * @param path The path of the model
 * @returns The model that was created
 */
function createModel(value: string, language?: string, path?: string) {
  return monaco.editor.createModel(
    value,
    language,
    path ? createModelUri(path) : undefined
  )
}

/**
 * createModelUri is a helper function that will create a new model uri
 * @param path The path of the model
 * @returns The model uri that was created
 */
function createModelUri(path: string) {
  return monaco.Uri.parse(path)
}

export function noop() {
  /** no-op */
}
