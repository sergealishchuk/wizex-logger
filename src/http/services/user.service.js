import Router from 'next/router'
import User from '~/components/User';
import { post, put, get } from '~/http/httpRequest';
import SocketServer from '~/socket';
import { setCookie, eraseCookie, _ } from '~/utils';

const signUp = (values) => {
  return post('users/signup', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function forgotpassword({ email }) {
  return post('/users/forgotyourpassword', { email })
    .then((response) => {
      const { user } = response;
      User.save(user);
      return user;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function confirmrecovercode({ email, code }) {
  return post('/users/confirmrecovercode', { email, code })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function recoverpasswordbycode({ email, code, password }) {
  return post('/users/recoverpassword', { email, code, password })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function updateUserProfile(data) {
  return put('/users/updateuserprofile', data)
    .then((response) => {
      const { data } = response;
      if (!_.isEmpty(data)) {
        const { email, firstname, lastname, phone } = data;
        const userInfo = {
          email,
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          phone,
        };
        User.updateUserInfo(userInfo);
      }
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getUserProfile() {
  return get('/users/getuserprofile')
    .then((response) => {
      const { user } = response;
      if (!_.isEmpty(user)) {
        const { email, firstname, lastname, phone, roles, uid, locked } = user;
        const userInfo = {
          email,
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
          phone,
          roles,
          uid,
          locked,
        };
        User.updateUserInfo(userInfo);
      }
      return response;
    })
    .catch(e => {
      const { XHRResponse } = e;
      if (XHRResponse) {
        const { status } = XHRResponse;
        if (status === 400) {
          SocketServer.disconnect();
          User.clear();
          Router.push('/');
        }
      }
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function login({ email, password }) {
  return post('/users/login_next', { email, password })
    .then((response) => {
      const { user } = response;
      User.save(user);
      const token = user.data.token;
      setCookie('token', token, 365);
      return user;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function logout() {
  return post('/users/logout', {})
    .then((response) => {
      eraseCookie('token');
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

function removeUserAccount({ password }) {
  return post('/users/removeuseraccount', { password })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


function updateNotifyToken({ token }) {
  return post('/users/updatenotifytoken', { token })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getUsers = (values) => {
  const url = '/admin/getusers';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const updateUserStatus = (values, options) => {
  const url = '/admin/updateuserstatus';

  return post(url, values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const checkAuthUser = (values, options = {}) => {
  const url = '/users/checkauthuser';

  return post(url, values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

export const userService = {
  userValue: () => User.get(),
  login,
  logout,
  signUp,
  forgotpassword,
  confirmrecovercode,
  recoverpasswordbycode,
  updateUserProfile,
  getUserProfile,
  removeUserAccount,
  updateNotifyToken,
  getUsers,
  updateUserStatus,
  checkAuthUser,
};
