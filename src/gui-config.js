import envConfig from '../backend/environments.config.js';
const APP_ENV = process.env.APP_ENV;
const MY_ENV = APP_ENV || "aliokscds";
const config = envConfig[MY_ENV];

const {
  server: { baseUrl, port },
  socketServer: { port: socketPort },
  storage: { storageImgUrl },
} = config;
const storageImg = `${storageImgUrl}${MY_ENV}/`;

const env_config = {
  "wizexloggerlocal": {
    "imagesUrl": storageImg,
    "apiUrl": `http://192.168.0.108${port ? `:${port}` : ''}${baseUrl}`,
    "socketUrl": `ws://192.168.0.108${socketPort ? `:${socketPort}` : ''}`
  },
  "wizexlogger": {
    "imagesUrl": storageImg,
    "apiUrl": `https://logger.wizex.pro${baseUrl}`,
    "socketUrl": 'wss://logger.wizex.pro'
  },
};

export default env_config[APP_ENV];
