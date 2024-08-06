import { _ } from '~/utils';
import SocketServer from '..';

async function getAllOrdersStatuses(values) {
  try {
    const response = await SocketServer.run('getAllOrdersStatuses', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

async function getOnlineUsersMonitor(values) {
  try {
    const response = await SocketServer.run('getOnlineUsersMonitor', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

async function getPushNotifications(values) {
  try {
    const response = await SocketServer.run('getPushNotifications', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

async function getOnlineOrdersUsers(values) {
  try {
    const response = await SocketServer.run('getOnlineOrdersUsers', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

export const ordersSocketService = {
  getAllOrdersStatuses,
  getOnlineUsersMonitor,
  getPushNotifications,
  getOnlineOrdersUsers,
};
