import { _ } from '~/utils';
import SingletonRouter, { Router } from 'next/router';
import Observer from '~/utils/observer';
import { DIALOG_ACTIONS } from '~/constants';

const { LEAVE_AND_DISCARD } = DIALOG_ACTIONS;

const originalChangeFunction = Router.prototype.change;

let formCollection = {};

export const useLeavePageConfirmation = ({ name, formChanged }) => {
  if (!SingletonRouter.router?.change) {
    return;
  }

  formCollection[name] = {
    formChanged,
  };

  const customRoutingControl = _.keys(formCollection).length > 0;

  if (customRoutingControl) {
    SingletonRouter.router.change = async (...args) => {
      const [ , , as, localeChangedObject] = args;
      const { locale: changedLocale } = localeChangedObject;
      const { locale: currentLocale } = SingletonRouter.router?.state;
      const currentUrl = SingletonRouter.router?.state.asPath.split('?')[0];
      const changedUrl = as.split('?')[0];
      const hasNavigatedAwayFromPage = currentUrl !== changedUrl;
      let confirmed = false;
      const hasDiffLocales = changedLocale && currentLocale && currentLocale !== changedLocale;

      let result;
      const shouldPreventLeaving = _.find(formCollection, item => item.formChanged);
      const attemptToChangeLocaleWhenFormChanged = (shouldPreventLeaving && hasDiffLocales);
      if (
        (shouldPreventLeaving && hasNavigatedAwayFromPage) || attemptToChangeLocaleWhenFormChanged
      ) {
        result = await Observer.asyncSend('OpenConfirmLeavePageDialog', {
          isLocaleChange: attemptToChangeLocaleWhenFormChanged,
        });
        confirmed = (result === LEAVE_AND_DISCARD);
        if (confirmed) {
          Router.prototype.change.apply(SingletonRouter.router, args);
          formCollection = {};
        }
      } else {
          Router.prototype.change.apply(SingletonRouter.router, args);
        formCollection = {};
      }
    }
  } else {
    SingletonRouter.router.change = originalChangeFunction;
  }
};
