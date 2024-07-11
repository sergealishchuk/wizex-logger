const execSync = require('child_process').execSync;
const {frontend: {port}} = require('../backend/utils/getConfig');

var args = process.argv.slice(2);
const devMode = args.includes('dev');

console.log('Port: ', port);

execSync(
  `PORT=${port} node ./node_modules/next/dist/bin/next ${devMode ? 'dev' : 'start'}`,
  {
    stdio: 'inherit'
  }
);
