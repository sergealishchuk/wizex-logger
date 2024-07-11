import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useLeavePageConfirmation } from '~/hooks';
import { DIALOG_ACTIONS } from '~/constants';

const { SAVE } = DIALOG_ACTIONS;

export default (props) => {
  const { depends = [], onFormChanged, name, onInit = _.noop, onSubmit } = props;

  const [formChanged, setFormChanged] = useState(false);
  const { dirty, submitForm, isSubmitting } = useFormikContext();

  useLeavePageConfirmation({
    name,
    formChanged: !isSubmitting && formChanged,
  });

  const calculateValue = (parameters = []) => _.reduce(
    parameters,
    (result, entity) => {
      return result || entity;
    },
    false
  );

  useEffect(() => {
    const formChanged = calculateValue([dirty, ...depends]);
    setFormChanged(formChanged);
    onInit();
  }, []);

  useEffect(() => {
    onFormChanged(formChanged);
  }, [formChanged]);

  useEffect(() => {
    const formChanged = calculateValue([dirty, ...depends]);
    setFormChanged(formChanged);
  }, [dirty, ...depends]);

  return null;
};
