const { runCommand, socketConnector } = require('../../utils');
const path = require('path');
const kill = require('tree-kill');

const { CICDProjects, CICDBuilds, sequelize } = require('../../models');

let buffer = [];

module.exports = async (params, options) => {
  const { buildId, startedAt } = options;
  try {
    console.log('build params :', params);
    console.log('build id:', buildId);
    //console.log('CICDBuilds:', CICDBuilds);
    const { branch, localProjectPath } = params;
    const branchShort = branch.replace(/^refs\/heads\//, '');
    const pm2Name = 'cdsdev';

    if (buffer.length > 0) {
      for (let index = 0; index < buffer.length; ++index) {
        console.log('KILL ', buffer[index]);
        kill(buffer[index]);
      }
      buffer = [];
    }

    const stringOut = [];
    const pushData = (string) => stringOut.push(string);

    const onScriptStart = (params) => {

      const { pid } = params;
      console.log('onScriptStart: pid =', pid, buffer);
      buffer.push(pid);
    };

    const onScriptFinish = async (code) => {
      console.log('onScriptFinish :', code);
      const scriptFile = path.resolve(__dirname, 'restartScript.sh');
      console.log('scriptFile:', scriptFile);
      const options = [
        '-p',
        pm2Name
      ];
      console.log('options:', options);

      const onScriptFilal = async (codeFinal) => {
        console.log('codeFinal', codeFinal);
        stringOut.push('EXIT CODE:  ', codeFinal);
        try {
          const result = await sequelize.transaction(async (transaction) => {
            const weblog = stringOut.join('\n').replace(/<br \/>/g, '');
            await CICDBuilds.update({
              log: weblog,
              status: codeFinal === 0 ? 1 : 2,
              longTimeSec: Number(((new Date().getTime() - new Date(startedAt).getTime()) / 1000).toFixed(0)),
            }, {
              where: {
                id: buildId,
              },
              transaction,
            });
            return {
              ok: true,
            }
          });

          if (result) {
            socketConnector.socketEmit({
              command: 'http.buildHasUpdated',
            });
          }
        } catch (e) {
          console.log('err:', e);
        }
      };

      if (code !== 0) {
        onScriptFilal(code);
      } else {
        await runCommand({
          command: scriptFile,
          args: options,
          onData: pushData,
          onStart: onScriptStart,
          onFinish: onScriptFilal,
        });
      }
    };

    let result;
    try {
      //const scriptFile = path.resolve(__dirname, 'buildScript.sh'); 
      const scriptFile = `${localProjectPath}/.deploy/buildScript.sh`;
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
    console.log('result:', result);
    const log = stringOut.join('\n');
    console.log(log);
    //const weblog = stringOut.join('<br /> ');
    const weblog = stringOut.join('\n').replace(/<br \/>/g, '');
    return {
      log: weblog,
    }
  } catch (e) {
    console.log('build error:', e);
  }
};
