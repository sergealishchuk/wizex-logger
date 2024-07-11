const { spawnSync, spawn } = require('child_process');
const path = require('path');
const servicesConfig = require('./services.config.json');

const { CICDProjects, CICDBuilds, sequelize } = require('../models');
const { socketConnector } = require('../utils');

//const SCRIPTS_PATH = '../'

// const runCommand = (command, args = [], scenario = '', onData = () => { }) => {
//   return new Promise(function (resolve, reject) {
//     const process = spawn(command, args, {
//       encoding: 'utf8',
//     });
//     process.on('close', function (code) {
//       resolve(code);
//       console.log('COMPLETED :', code);
//     });
//     process.on('exit', function (code) {
//       resolve(code);
//       console.log('EXIT:', code);
//     });
//     process.stderr.on('data', function (err) {
//       console.log('[ error ]:', `${err.toString()}`);
//       onData(`[ error ]: ${err.toString()}`);
//       if (scenario !== 'build-front' && scenario !== 'get-pull') {
//         reject(err);
//       }
//     });
//     process.on('error', function (err) {
//       reject(err);
//     });
//     process.stdout.on('data', function (data) {
//       console.log(`${data.toString()}`);
//       onData(`${data.toString()}`);
//     });
//   });
// };

// console.log('dirname: ', path.dirname, path.dirname(require.main.filename));

// const createParams = (params) => {
//   const keys = Object.keys(params);
//   const arg = [];
//   keys.map(item => {
//     if (item === 'install' && params[item]) {
//       arg.push('-i');
//     } else if (item === 'build' && params[item]) {
//       arg.push('-b');
//     } else if (item === 'restart' && params[item]) {
//       arg.push('-r');
//     }
//   });
//   console.log('params', params);
//   console.log('arg', arg);
//   return arg;
// };

module.exports = async (req) => {
  try {
    const result = await sequelize.transaction(async (transaction) => {
      const { body: { ref, repository: { url }, head_commit } } = req;
      // console.log('req.body::', req.body);
      // console.log('ref:', ref);
      console.log('ref:', ref);
      console.log('url:', url);
      console.log('commit:', head_commit);
      console.log('---------------------------');
      //console.log(req);
      //let time = new Date().getTime();
      const project = await CICDProjects.findOne({
        transaction,
        where: {
          active: true,
          branch: ref,
          repoLink: url,
        },
        raw: true,
      });

      console.log('project:', project);

      if (project) {
        const { id: projectId, branch, config, localScriptsPath } = project;

        // const updateAcitve = await CICDBuilds.update({
        //   status: 3,
        // }, {
        //   where: {
        //     projectId,
        //     status: 0,
        //   },
        //   transaction,
        // });

        const listInProccess = await CICDBuilds.findAll({
          where: {
            projectId,
            status: 0,
          },
          transaction,
          attributes: ['id', 'startedAt'],
          raw: true,
        });

        for (let index = 0; index < listInProccess.length; ++index) {
          const buildRecord = listInProccess[index];
          const { id, startedAt } = buildRecord;
          await CICDBuilds.update({
            status: 3,
            longTimeSec: Number(((new Date().getTime() - new Date(startedAt).getTime()) / 1000).toFixed(0)),
          }, {
            where: {
              id,
            },
            transaction,
          });
        }

        const newCommit = await CICDBuilds.create(
          {
            projectId,
            branch,
            commit: JSON.stringify(head_commit),
          },
          {
            transaction,
            raw: true,
          },
        );

        const buildScript = path.resolve(path.dirname(require.main.filename), `${localScriptsPath}/build.js`);
        console.log('buildScript:', buildScript);
        const script = require(buildScript);
        const { id: buildId, startedAt } = newCommit; 
        if (script) {
          res = script(project, {
            buildId,
            startedAt,
          });
          console.log('!!!!!!!!!! res::::', res);
        }

      }
      //console.log('Time:',  (new Date().getTime() - time) / 1000);


      return {
        ok: true,
      }
    });

    if (result) {
      console.log('send from backend to socket - http.buildHasUpdated');
      socketConnector.socketEmit({
        command: 'http.buildHasUpdated',
      });
    }
  } catch (e) {
    console.log(e);
  };
}


/*
  //console.log('servicesConfig', JSON.stringify(servicesConfig, null, 4));

  const BRANCH = 'develop';

  const stringOut = [];
  const pushData = (string) => stringOut.push(string);

  const addTitleSection = (name, service) => {
    pushData("");
    pushData("*".repeat(80));
    pushData(`Service Name: ${name}`);
    const operationList = Object.keys(service).filter(item => service[item]).join(', ');
    pushData(`Operation: ${operationList}`);
    pushData("*".repeat(80));
  }

  try {
    console.log('start::');
    const currentCommit = spawnSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).stdout;
    const forcePull = spawnSync('git', ['pull']);
    console.log('forcePull', `${forcePull.stdout.toString()}`);
    
    //const prevCommit = '46e87b5b079b4ae6f76cf17957a8fd68bd7c5322';
   
    const lastCommit = spawnSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).stdout;

    console.log('Current commit:', currentCommit);
    console.log('Last commit::', lastCommit);

    const filesDiff = spawnSync('git', ['diff', '--numstat', currentCommit, 'HEAD'], {
      encoding: 'utf8',
      stdin: ['inherit', 'pip', 'pip'],
    }).stdout;

    console.log('filesDiff:', filesDiff);

    const filesDiffSplited = filesDiff.split('\n').map(item => item.split('\t')[2]).slice(0, -1);
    const { services } = servicesConfig;
    console.log('filesDiffSplited:', filesDiffSplited);

    let next = true;
    // const getPullPath = path.resolve(__dirname, 'get-pull.sh');
    // try {
    //   const result2 = await runCommand(getPullPath, [BRANCH], 'get-pull', pushData);
    // } catch (err) {
    //   console.log('[catch error1]:', `${err.toString()}`);
    //   next = false;
    // }

    const updates = {};
    for (let serviceIndex = 0; serviceIndex < services.length; ++serviceIndex) {
      const service = services[serviceIndex];
      const { name, install = [], build = false, restart } = service;

      if (install.length > 0) {
        const hasInstall = filesDiffSplited.find(item => item === install[0]);
        if (hasInstall) {
          updates[name] = {
            install: true,
            build,
            restart: true,
          };
          continue;
        }
      }

      const hasChanges = filesDiffSplited.find(item => restart.find(el => {
        const regex = new RegExp(el);
        return regex.test(item);
      }));

      if (hasChanges) {
        updates[name] = {
          install: false,
          build,
          restart: true,
        };
      }
    }

    const actualServices = Object.keys(updates);

    if (actualServices.length > 0) {
      // const getPullPath = path.resolve(__dirname, 'get-pull.sh');
      for (let index = 0; index < actualServices.length; ++index) {
        const serviceName = actualServices[index];
        const service = updates[serviceName];

        // try {
        //   const result2 = await runCommand(getPullPath, [BRANCH], 'get-pull', pushData);
        // } catch (err) {
        //   console.log('[catch error1]:', `${err.toString()}`);
        //   next = false;
        // }

        if (next && serviceName === 'front') {
          try {
            const getPullPath2 = path.resolve(__dirname, 'build-front.sh');
            const options = createParams(service);
            addTitleSection('FRONTEND', service);
            const resultPull2 = await runCommand(getPullPath2, options, 'build-front', pushData);
          } catch (err) {
            console.log('[catch error2]:', `${err.toString()}`);
            next = false;
          }
        }

        if (next && serviceName === 'backend') {
          try {
            const getPullPath3 = path.resolve(__dirname, 'build-backend.sh');
            const options = createParams(service);
            addTitleSection('BACKEND', service);
            const resultPull3 = await runCommand(getPullPath3, options, 'build-backend', pushData);
          } catch (err) {
            console.log('[catch error3]:', `${err.toString()}`);
            next = false;
          }
        }

        if (next && serviceName === 'backendSocket') {
          try {
            const getPullPath4 = path.resolve(__dirname, 'build-backend-socket.sh');
            const options = createParams(service);
            addTitleSection('BACKEND-SOCKET', service);
            const resultPull4 = await runCommand(getPullPath4, options, 'build-backend-socket', pushData);
          } catch (err) {
            console.log('[catch error4]:', `${err.toString()}`);
            next = false;
          }
        }

        if (next && serviceName === 'randomGenerator') {
          try {
            const getPullPath5 = path.resolve(__dirname, 'build-random-generator.sh');
            const options = createParams(service);
            addTitleSection('RANDOM GENERATOR', service);
            const resultPull5 = await runCommand(getPullPath5, options, 'build-random-generator', pushData);
          } catch (err) {
            console.log('[catch error5]:', `${err.toString()}`);
            next = false;
          }
        }
      }

      if (next) {
        const success = 'SUCCESS FINISH!';
        console.log(success);
        pushData("*".repeat(80));
        pushData(success);
      } else {
        const faild = 'BUILD FAILED!';
        console.log(faild);
        pushData("*".repeat(80));
        pushData(faild);
      }
      console.log('FROM BUFFER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(stringOut.join('\n'));
      console.log('ENDED BUFFER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
  } catch (e) {
    console.log('my error:', e);
    return {
      error: 'build config has problem'
    }
  }
  return {
    ok: true,
  }
//};
*/
