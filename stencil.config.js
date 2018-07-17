const sass = require('@stencil/sass');

exports.config = {
  namespace: 'wc-calendar',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ],
  plugins: [
    sass()
  ],
  globalStyle: [
    'src/globals/app.scss'
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
