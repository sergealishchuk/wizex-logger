import { _ } from '~/utils';
import io from 'socket.io-client';
import backendRoutes from './backend/backend.routes';
import { changesBackendSocketService } from './backend';

const backendCommandList = Object.assign(
  {},
  ...backendRoutes.map(route => ({ [route.command]: route.handlerProcedureName }))
);

import guiConfig from "~/gui-config";
import User from '~/components/User';

const { socketUrl } = guiConfig;

const socketServer = class {
  constructor() {
    this.socket = null;
  };

  connect() {
    const userInfo = User.read();

    if (userInfo && userInfo.data) {
      const { token } = userInfo.data;

      if (token && !this.socket) {
        this.socket = io(socketUrl, {
          query: {
            token,
          },
          cors: {
            origin: '*',
          },
        });

        if (typeof (window) !== 'undefined') {
          window.connection = this;
        }

        this.socket.on('connect', () => {
          console.log('socket connected');
        });

        this.socket.on('disconnect', () => {
          console.log('socket disconnected');
        });

        this.socket.on("connect_error", (err) => {
          const { message } = err;
          if (/poll/.test(message)) {
            console.log('Service not available. Polling error!!!');
          }
        });

        this.socket.on('run', (props, callback) => {
          const { command, params } = props;

          const procedureName = backendCommandList[command];
          if (procedureName && changesBackendSocketService[procedureName]) {
            changesBackendSocketService[procedureName](params, callback);
          }
        });
      }
    }
  };

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };

  async run(command, params) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('No socket connection.');
      } else {
        this.socket.emit('run', { command, params }, (response) => {
          if (response.error) {
            reject(response.error);
          } else if (response.ok) {
            const { data } = response;
            resolve(data);
          }
        });
      }
    });
  };
};

const SocketServerInstance = new socketServer();

export default SocketServerInstance;
