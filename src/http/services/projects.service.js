import { _ } from '~/utils';
import { post, put, get } from '~/http/httpRequest';

const getProjects = async (options = {}) => {
  return get('/projects/getprojects', options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getActiveProjects = async (options = {}) => {
  return get('/projects/getactiveprojects', options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getProjectInfo = async (values = {}, options = {}) => {
  return post('/actions/getallactions', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getBuildDetail = async (values = {}, options = {}) => {
  return post('/builds/getactiondetail', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const setActiveProject = async (values = {}, options = {}) => {
  return post('/projects/setactiveproject', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const pushEmptyCommit = async (values = {}, options = {}) => {
  return post('/projects/pushemptycommit', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addProject = async (values = {}, options = {}) => {
  return post('/projects/addproject', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const updateProject = async (values = {}, options = {}) => {
  return post('/projects/updateproject', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const deleteProject = async (values = {}, options = {}) => {
  return post('/projects/deleteproject', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const generateApiKeyForProject = async (values = {}, options = {}) => {
  return post('/projects/generateapikey', values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

export const projectsService = {
  getProjects,
  getActiveProjects,
  getProjectInfo,
  getBuildDetail,
  setActiveProject,
  pushEmptyCommit,
  addProject,
  updateProject,
  deleteProject,
  generateApiKeyForProject,
};
