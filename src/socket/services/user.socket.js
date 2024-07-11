import { _ } from '~/utils';
import SocketServer from '..';

async function logoutUser(values) {
  try {
    const response = await SocketServer.run('logoutUser', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

async function visible(values) {
  try {
    const response = await SocketServer.run('visible', values);
    return response;
  } catch (e) {
    console.log(e);
    const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Socket Connection Error" }] } });
    return error;
  }
};

export const userSocketService = {
  logoutUser,
  visible,
};
