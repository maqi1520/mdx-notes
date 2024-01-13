const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

const headers = [
  {
    key: 'Access-Control-Allow-Origin',
    value: '*',
  },
]

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.maqib.cn',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
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
            r.issuer.or = [
              ...r.issuer.and,
              /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            ]
            delete r.issuer.and
          }
        })
      })

    config.output.globalObject = 'self'
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['markdown', 'css', 'typescript', 'javascript', 'html'],
          filename: 'static/chunks/[name].worker.js',
        })
      )
    }

    return config
  },
}
