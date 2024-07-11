const { spawnSync } = require('child_process');
const moment = require('moment');
const reduce = require('lodash/reduce');
const get = require('lodash/get');

// eslint-disable-next-line no-undef
module.exports = () => {
  try {
    const commitInfo = spawnSync('git', ['--work-tree=.', 'log', '-1'], {
      encoding: 'utf8',
    }).stdout.match(/(?:\w\s)(.*)(?:\n)/);
    const inputInfo = commitInfo.input.split('\n');
    const dataList = reduce(
      inputInfo,
      (result, element) => {
        const splitElement = element.split(' ');
        if (splitElement.length > 1 && /^\w/.test(splitElement[0])) {
          result.push([
            splitElement[0].trim(),
            splitElement.slice(1).join(' ').trim(),
          ]);
        }
        return result;
      },
      []
    );
    const commitDateStr = get(
      dataList.filter(element => /Date/.test(element[0])),
      '[0][1]'
    );
    const commitDate = new Date(commitDateStr).toLocaleString('en-GB');
    const branch = spawnSync('git', ['--work-tree=.', 'branch'], {
      encoding: 'utf8',
    }).stdout.match(/(?:\*\s)(.*)(?:\n)/)[1];

    return `${branch} - [ ${commitInfo[1].slice(0, 7)} ] - ${commitDate}`;
  } catch (e) {
    return `unknown-${moment.utc().format()}`;
  }
};
