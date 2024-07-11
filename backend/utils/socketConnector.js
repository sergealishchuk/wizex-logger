const { io } = require('socket.io-client');
require('dotenv').config({ path: '../.env' });
const { APP_ENV = 'development' } = process.env;
console.log('Environment from Socket Connector: ', APP_ENV);
const { socketServer } = require('../config/config');
console.log('socketServer', socketServer)

const socket = io(`http://127.0.0.1:${socketServer.port}`, {});

socket.on('connect', function () {
  console.log('socket connect');
});
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on('disconnect', function () {
  console.log('socket disconect');
});

module.exports = {
  socket,
  socketEmit: ({ command, params }) => {
    socket.emit('run', {
      command,
      params: {
        data: params,
      }
    });
  }
};
