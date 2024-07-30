'use client';

import { enqueueSnackbar } from 'notistack';
import { translateByCode } from '~/utils';

/*

    pushResponseMessages({
      ERROR_CODE: {
        name: 'ATTAMPT_TO_REMOVE_SUBCATEGORIES',
        params: {
          exist: 122,
        }
      }
    })
*/


export default (response, snackbar = true) => {
  const {
    ERROR_CODE,
    SUCCESS_CODE,
    INFO_CODE,
    WARNING_CODE,
  } = response;

  if (ERROR_CODE) {
    let { name, params } = ERROR_CODE;
    name = name || ERROR_CODE;

    const translateResult = translateByCode(
      name,
      { ns: 'errors', params }
    );

    if (snackbar) {
      enqueueSnackbar(translateResult, { variant: 'error' });
    } else {
      return translateResult;
    }

  } else if (SUCCESS_CODE) {
    let { name, params } = SUCCESS_CODE;
    name = name || SUCCESS_CODE;

    const translateResult = translateByCode(
      name,
      { ns: 'successes', params }
    );
    
    if (snackbar) {
      enqueueSnackbar(translateResult, { variant: 'success' });
    } else {
      return translateResult;
    }

  } else if (INFO_CODE) {
    let { name, params } = INFO_CODE;
    name = name || INFO_CODE;

    const translateResult = translateByCode(
      name,
      { ns: 'infos', params }
    );

    if (snackbar) {
      enqueueSnackbar(translateResult, { variant: 'info' });
    } else {
      return translateResult;
    }

  } else if (WARNING_CODE) {
    let { name, params } = WARNING_CODE;
    name = name || WARNING_CODE;

    const translateResult = translateByCode(
      name,
      { ns: 'warnings', params }
    );

    if (snackbar) {
      enqueueSnackbar(translateResult, { variant: 'warning' });
    } else {
      return translateResult;
    }
  }
};
