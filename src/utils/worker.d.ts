declare module '*.worker.js' {
  class PrettierWorker extends Worker {
    constructor()
  }

  export default PrettierWorker
}
