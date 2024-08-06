const { runCommand } = require('../../utils');
const path = require('path');
const kill = require('tree-kill');

const buffer = [];

module.exports = async (params, options) => {
  const { commit, CICDBuilds, transaction } = options;;
  try {
    console.log('build params :', params);
    console.log('COMMIT:', commit);
    console.log('CICDBuilds:', CICDBuilds);
    const { branch, localProjectPath } = params;
    const branchShort = branch.replace(/^refs\/heads\//, '');
    const pm2Name = 'cds';

    if (buffer.length > 0) {
      for (let index = 0; index < buffer.length; ++index) {
        console.log('KILL ', buffer[index]);
        kill(buffer[index]);
      }
    }

    const stringOut = [];
    const pushData = (string) => stringOut.push(string);

    const onScriptStart = (params) => {
      const { pid } = params;
      buffer.push(pid);
    };

    const onScriptFinish = async (code) => {
      const scriptFile = path.resolve(__dirname, 'restartScript.sh');
      const options = [
        '-p',
        pm2Name
      ];
      console.log('options:', options);

      const onScriptFilal = (codeFinal) => {
        console.log('codeFinal', codeFinal);
      };

      await runCommand({
        command: scriptFile,
        args: options,
        onData: pushData,
        onStart: onScriptStart,
        onFinish: onScriptFilal,
      });
    };

    let result;
    try {
      const scriptFile = path.resolve(__dirname, 'buildScript.sh');
      console.log('scriptFile :', scriptFile);
      const options = [
        '-b',
        branchShort,
        '-l',
        localProjectPath,
        '-p',
        pm2Name
      ];
      console.log('options:', options);
      result = await runCommand({
        command: scriptFile,
        args: options,
        onData: pushData,
        onStart: onScriptStart,
        onFinish: onScriptFinish,
      });

    } catch (err) {
      console.log('[catch error2]:', `${err.toString()}`);
    }
    console.log('result: ', result);
    const log = stringOut.join('\n');
    console.log(log);
    const weblog = stringOut.join('<br />');
    return {
      log: weblog,
    }
  } catch (e) {
    console.log('build error:', e);
  }
};
