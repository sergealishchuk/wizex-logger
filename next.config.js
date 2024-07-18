const { i18n } = require('./next-i18next.config');
const getBuildVersion = require('./src/utils/getBuildVersion');
const url_rewrites = require('./next.rewrites');

module.exports = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.alioks.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'http://192.168.0.108/rest' // development api
      : 'http://127.0.0.1:8099/rest' // production api
  },
  reactStrictMode: false,
  i18n,
  webpack: (config, { webpack }) => {
    const exportedKeys = ['APP_ENV', 'FIREBASE_PUBLIC_KEY', 'SERVER_NAME']
    const envKeys = exportedKeys.reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
      return prev;
    }, {});

    config.plugins.push(
      new webpack.DefinePlugin({
        _BUILD_VERSION_: JSON.stringify(getBuildVersion()),
        APP_ENV: JSON.stringify(process.env.APP_ENV)
      }),
    );

    config.plugins.push(
      new webpack.DefinePlugin(envKeys),
    );

    // Important: return the modified config
    return config;
  },
  
  async rewrites() {
    return url_rewrites();
  }
}
