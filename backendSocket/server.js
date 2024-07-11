require('dotenv').config({ path: '../.env' });
global.APP_ENV = process.env.APP_ENV || 'development';

const _ = require('lodash');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const routes = require('./socket.routes.json');

// require('dotenv').config({ path: '../.env' });
const { JWT_SECRET_KEY } = process.env;
global.APP_ENV = APP_ENV || 'development';

console.log('Environment: ', APP_ENV);

const config = require('../backend/config/config');
const { port } = config["socketServer"];

const isPromise = (promise) => promise instanceof Promise;

const commandsList = Object.assign(
  {},
  ...routes.map(route => ({ [route.command]: route.handlerPath }))
);

const connections = {};

const addConnection = (socket) => {
  const { data = {} } = socket;
  const { id: userId } = data;
  if (userId) {
    if (!connections[userId]) {
      connections[userId] = [socket]
    } else {
      connections[userId].push(socket);
    }
  }
};

const removeConnection = (socket) => {
  const id = _.get(socket, 'data.id');
  if (id) {
    const userPool = connections[id];
    if (userPool) {
      userPool.splice(userPool.indexOf(socket), 1);
      if (userPool.length > 0) {
        connections[id] = userPool;
      } else {
        delete connections[id];
      }
    }
  }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.use(function (socket, next) {
  const handshake = _.get(socket, 'handshake');
  const token = _.get(socket, 'handshake.query.token');
  const { headers: { host } } = handshake;
  if (host === `127.0.0.1:${port}`) {
    console.log('http connected!');
    next();
  } else {
    try {
      tokenPayload = jwt.verify(token, JWT_SECRET_KEY);
      const { id } = tokenPayload;
      const { address, headers } = socket.handshake;
      socket.data = {
        ...tokenPayload,
        loginTime: new Date(),
        address,
        userAgent: headers['user-agent'],
        visible: true,
      };
      next();
    } catch (e) {
      console.log(e);
      next(new Error('Authentication error'));
    }
  }
});

io.on('connection', function (socket) {
  addConnection(socket);

  socket.on("disconnect", (reason) => {
    removeConnection(socket);
  });

  socket.on('run', (props, callback = _.noop) => {
    const { command, params = {} } = props;
    if (commandsList[command]) {
      const runner = require(commandsList[command]);

      const result = runner({
        ...params,
        connections,
        socket,
      }, socket.data);

      if (result && isPromise(result)) {
        result.then((queryResult) => {
          callback(queryResult);
        });
      }
    }
  });
});

const PORT = process.env.PORT || port;

server.listen(PORT, () => console.log(`Socket Server running on port ${PORT}`));
