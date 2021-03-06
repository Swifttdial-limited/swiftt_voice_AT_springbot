export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    //'transform-decorators-legacy',
    ['import', {'libraryName': 'antd', 'libraryDirectory': 'es', 'style': true}],
  ],
  env: {
    development: {
      'extraBabelPlugins': [
        'dva-hmr',
      ],
    },
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  publicPath: '/',
  disableDynamicImport: true,
  hash: true,
};
