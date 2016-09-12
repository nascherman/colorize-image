const budo = require('budo');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const lessStream = require('less-css-stream');
const AutoPrefix = require('less-plugin-autoprefix');

const alert = () => console.log('\x07');
const lessFile = path.resolve(__dirname, '../lib/less/index.less');
const outputCss = path.resolve(__dirname, '../app/assets/css/main.css');

const isProduction = process.argv[2] === 'production';

const lessOpts = {
  paths: [],
  compress: isProduction,
  plugins: [ new AutoPrefix() ]
};

function compileLESS () {
  const writer = fs.createWriteStream(outputCss);
  writer.on('error', err => console.error(err));

  fs.createReadStream(lessFile)
    .on('error', err => console.error(err.message))
    .pipe(lessStream(lessFile, lessOpts))
    .on('error', err => {
      console.error(chalk.red('Error in ' + chalk.bold(lessFile)));
      console.error(err.message);
      alert();
    })
    .pipe(writer);
}

function startDevServer () {
  const app = budo('lib/index.js:bundle.js', {
    dir: 'app',
    debug: true,
    browserify: {
      transform: [ require('babelify') ]
    },
    stream: process.stdout
  }).live()
    .watch(['lib/less/**/*.less', 'app/**/*.{css,html}'])
    .on('watch', (ev, file) => {
      if (path.extname(file) === '.less') {
        compileLESS();
      } else {
        app.reload(file);
      }
    })
    .on('pending', () => app.reload())
    .on('connect', compileLESS);
}

if (!isProduction) {
  startDevServer();
} else {
  compileLESS();
}
