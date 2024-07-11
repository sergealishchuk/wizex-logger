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


export default (response) => {
  const {
    ERROR_CODE,
    SUCCESS_CODE,
    INFO_CODE,
    WARNING_CODE,
  } = response;

  if (ERROR_CODE) {
    let { name, params } = ERROR_CODE;
    name = name || ERROR_CODE;

    enqueueSnackbar(translateByCode(
      name,
      { ns: 'errors', params, }
    ), { variant: 'error', });

  } else if (SUCCESS_CODE) {
    let { name, params } = SUCCESS_CODE;
    name = name || SUCCESS_CODE;

    enqueueSnackbar(translateByCode(
      name,
      { ns: 'successes', params, }
    ), { variant: 'success', });

  } else if (INFO_CODE) {
    let { name, params } = INFO_CODE;
    name = name || INFO_CODE;

    enqueueSnackbar(translateByCode(
      name,
      { ns: 'infos', params, }
    ), { variant: 'info', });

  } else if (WARNING_CODE) {
    let { name, params } = WARNING_CODE;
    name = name || WARNING_CODE;

    enqueueSnackbar(translateByCode(
      name,
      { ns: 'warnings', params, }
    ), { variant: 'warning', });
  }
};
