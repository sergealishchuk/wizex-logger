import { _ } from '~/utils';
import Observer from '~/utils/observer';
import User from '~/components/User';
import SocketServer from '..';
import Router from 'next/router';

async function logoutHandler(values, callback) {
  callback({ status: 'logout done' });
  User.clear();
  SocketServer.disconnect();
  Observer.send('OpenSignInDialog', {}, (router) => {
    router.reload();
  });
};

async function buildsStatusesUpdated(values, callback) {
  console.log('buildStatusesUpdated');
  const path = Router.asPath;
  Observer.send('onBuildsStatatusesUpdated');
}

async function projectStatusesUpdated(values, callback) {
  Observer.send('onProjectStatatusesUpdated');
}

export const changesBackendSocketService = {
  logoutHandler,
  buildsStatusesUpdated,
  projectStatusesUpdated,
};
