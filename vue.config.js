const path = require('path');
const PROJECT_VIEW_PATH =
  process.env.PROJECT_VIEW_PATH ||
  'src/presentation/fashion/';

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 12000,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      '/api/ai': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/mcp': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "presentation/assets/scss/_global.scss";
        `,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        presentation: path.resolve(
          __dirname,
          PROJECT_VIEW_PATH
        ),
        containers: path.resolve(
          __dirname,
          'src/containers'
        ),
        react: path.resolve(__dirname, 'composition/react'),
        hooks: path.resolve(__dirname, 'composition'),
        SASS: path.resolve(
          __dirname,
          'presentation/assets/scss'
        ),
      },
    },
  },
};
