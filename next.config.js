const path = require('path')

module.exports = {
  async headers() {
    return [
      {
        source: '/plugins/:path*',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer, webpack, dev }) => {
    config.module.rules
      .filter((rule) => rule.oneOf)
      .forEach((rule) => {
        rule.oneOf.forEach((r) => {
          if (
            r.issuer &&
            r.issuer.and &&
            r.issuer.and.length === 1 &&
            r.issuer.and[0].source &&
            r.issuer.and[0].source.replace(/\\/g, '') ===
              path.resolve(process.cwd(), 'src/pages/_app')
          ) {
            console.log(r.issuer.and)
            r.issuer.or = [
              ...r.issuer.and,
              /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            ]
            delete r.issuer.and
          }
        })
      })

    config.output.globalObject = 'self'

    let workers = [
      {
        label: 'editor.worker',
        id: 'vs/editor/editor',
        entry: 'vs/editor/editor.worker',
      },
      {
        label: 'html.worker',
        id: 'vs/language/html/htmlWorker',
        entry: 'vs/language/html/html.worker',
      },
      {
        label: 'css.worker',
        id: 'vs/language/css/cssWorker',
        entry: 'vs/language/css/css.worker',
      },
      {
        label: 'ts.worker',
        id: 'vs/language/typescript/tsWorker',
        entry: 'vs/language/typescript/ts.worker',
      },
    ]

    config.plugins.push(
      ...workers.map(
        ({ label, id, entry }) =>
          new AddWorkerEntryPointPlugin({
            id,
            label,
            entry: require.resolve(path.join('monaco-editor/esm', entry)),
            filename: isServer ? `${label}.js` : `static/chunks/${label}.js`,
            chunkFilename: isServer
              ? `${label}.js`
              : `static/chunks/${label}.js`,
            plugins: [
              new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
            ],
          })
      )
    )

    return config
  },
}

/**
 * AddWorkerEntryPointPlugin
 * https://github.com/microsoft/monaco-editor/blob/57e51563851acfda93b532aa7812159943527c7b/monaco-editor-webpack-plugin/src/plugins/AddWorkerEntryPointPlugin.ts
 */
function getCompilerHook(
  compiler,
  { id, label, entry, filename, chunkFilename, plugins }
) {
  const webpack = compiler.webpack

  return function (compilation, callback) {
    const outputOptions = {
      filename,
      chunkFilename,
      publicPath: compilation.outputOptions.publicPath,
      // HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
      globalObject: 'this',
    }
    const childCompiler = compilation.createChildCompiler(id, outputOptions, [
      new webpack.webworker.WebWorkerTemplatePlugin(),
      new webpack.LoaderTargetPlugin('webworker'),
    ])
    const SingleEntryPlugin = webpack.EntryPlugin
    new SingleEntryPlugin(compiler.context, entry, label).apply(childCompiler)
    plugins.forEach((plugin) => plugin.apply(childCompiler))

    childCompiler.runAsChild((err) => callback(err))
  }
}

class AddWorkerEntryPointPlugin {
  constructor({
    id,
    label,
    entry,
    filename,
    chunkFilename = undefined,
    plugins,
  }) {
    this.options = { id, label, entry, filename, chunkFilename, plugins }
  }

  apply(compiler) {
    const webpack = compiler.webpack
    const compilerHook = getCompilerHook(compiler, this.options)
    const majorVersion = webpack.version.split('.')[0]
    if (parseInt(majorVersion) < 4) {
      compiler.plugin('make', compilerHook)
    } else {
      compiler.hooks.make.tapAsync('AddWorkerEntryPointPlugin', compilerHook)
    }
  }
}
