import { translateByCode, _ } from '~/utils';

// const _ = {
//   get,
//   isObject,
//   isString,
// }

export default (error, locale) => {

  const { errorCode, XHRResponse, message, stack } = error;

  if (!XHRResponse && message) {
    return {
      props: {
        pageParams: {
          error: {
            code: 'MODULE_ERROR',
            status: 417,
            errors: [{ message }, {message: String(stack)}],
          }
        }
      }
    }
  };

  if (XHRResponse && XHRResponse.code === 417) {
    return {
      props: {
        pageParams: {
          error: {
            code: XHRResponse.ERROR_CODE,
            status: 417,
            errors: [{ message: XHRResponse.stack }],
          }
        }
      }
    }
  }

  let errorText = '';
  if (errorCode) {
    errorText = translateByCode(errorCode, { locale });
  }

  let status;

  const response = _.get(error, 'XHRResponse');
  if (response) {
    const { status: currentStatus, statusText } = response;
    if (currentStatus) {
      status = currentStatus;
    }

  }

  let code;
  const responseData = error.typeOfError ? _.get(error, 'XHRResponse.data') : _.get(error, 'response.data');
  code = _.get(error, 'code');
  const originalMessage = _.get(error, 'message', errorText);

  let errorList;

  if (_.isString(responseData)) {
    if (!status) {
      status = _.get(error, 'response.status');
    }
  } else if (_.isObject(responseData)) {
    if (!status) {
      status = responseData.status;
    }
    code = responseData.code;
    errorList = _.get(responseData, 'error.errors');
  }

  const result = {
    props: {
      pageParams: {
        error: {
          code: code || errorCode,
          status: status || 503,
          errors: errorList ? errorList : [{ message: originalMessage }],
        }
      }
    }
  }

  return result;
};
