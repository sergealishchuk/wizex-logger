import User from "~/components/User";

module.exports = async ({ fn, validate, interval, maxAttempts, options = {} }) => {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    let result;
    const { hiddenMonitoring } = options;
    const userLogged = User.isLog();

    if (userLogged && (hiddenMonitoring || (document && !document.hidden))) {
      result = await fn();
    }

    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};
