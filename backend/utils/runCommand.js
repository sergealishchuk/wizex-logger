const { spawn } = require('child_process');

module.exports = ({
  command,
  args = [],
  scenario = '',
  onData = () => { },
  onStart = () => { },
  onFinish = () => { },
}) => {
  return new Promise(function (resolve, reject) {
    const process = spawn(command, args, {
      encoding: 'utf8',
      stdio: 'pipe',
      shell: true,
    });
    onStart(process);

    process.on('close', function (code) {
      resolve(code);
      console.log('COMPLETED:', code);
      onData(`COMPLETED: ${code}`);
      onFinish(code);
    });

    process.on('exit', function (code) {
      resolve(code);
      console.log('EXIT:', code);
      onData(`EXIT: ${code}`);
    });

    process.stderr.on('data', function (err) {
      console.log('[ error ]:', `${err.toString()}`);
      onData(`[ error ]: ${err.toString()}`);
      if (scenario !== 'build-front' && scenario !== 'get-pull') {
        reject(err);
      }
    });

    process.stdout.on('data', function (data) {
      console.log(`${data.toString()}`);
      onData(`${data.toString()}`);
    });

    process.on('error', function (err) {
      reject(err);
      onData(`ERROR: ${err.toString()}`);
    });
  });
};