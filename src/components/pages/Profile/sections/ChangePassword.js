import React, { useState, useEffect, useRef } from 'react';
import { _, getResponseMessage } from '~/utils';
import { Formik, Form } from "formik";
import * as yup from 'yup';
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import EditForm from "~/components/EditForm";
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Observer from "~/utils/observer";
import { userService } from '~/http/services';
import { ErrorMessages } from '~/components/ErrorMessages';
import PasswordField from '~/components/formik/PasswordField';
import SubmitController from '~/components/formik/SubmitController';
import { useTranslation } from 'next-i18next';

export default ({ data, icon, expand, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const [shortScenario, setShortScenario] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState({
    password: '',
    newpassword: '',
  });
  const { t } = useTranslation(['buttons', 'profile_main', 'profile_change_password']);

  const validationSchema = yup.object().shape({
    password: yup
      .string(t('enter_current_password', { ns: 'profile_change_password' }))
      .min(6, t('current_password_validate', { ns: 'profile_change_password' }))
      .required(t('current_password_is_required', { ns: 'profile_change_password' })),
    newpassword: yup
      .string(t('enter_new_password', { ns: 'profile_change_password' }))
      .min(6, t('new_password_validate', { ns: 'profile_change_password' }))
      .required(t('new_password_is_required', { ns: 'profile_change_password' })),
  });

  useEffect(() => {
    if (!expand && editMode) {
      onCancel();
    }
    if (expand && shortScenario) {
      setEditMode(true);
    }
  }, [expand]);

  const onSubmit = async (values, { setSubmitting }) => {

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserProfile(values);

    Observer.send('SpinnerShow', false);

    if (result && result.error) {
      const message = getResponseMessage(result);
      console.log('result', result);
      console.log('message', message);
      if (message) {
        setErrors([{ message }]);
      }
      setSubmitting(false);
    } else {
      if (result.ok) {
        enqueueSnackbar(t('profile_success_updated', { ns: 'profile_main' }), { variant: 'success' });
        onCancel();
      }
    }
  };

  const onEdit = () => {
    setEditMode(true);
  };

  const onCancel = () => {
    const formik = refFormik.current;
    setErrors([]);
    formik.resetForm();
    setEditMode(false);
    expandAction(expandId, true);
    setShortScenario(false);
  };

  const handleFormChange = () => {
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleOnCollapse = (open) => {
    if (!open) {
      onCancel();
    }
  };

  const handleOnKeyUp = (event) => {
    const { code } = event;
    if (code === 'Escape') {
      onCancel();
    }
  };

  const handleExpandAction = (expandId, expand, isUser) => {
    if (!expand && isUser) {
      setShortScenario(true);
    }
    return expandAction(expandId, expand, isUser);
  };

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };

  return (
    <EditForm
      title={`${t('title', { ns: 'profile_change_password' })}`}
      onCollapse={handleOnCollapse}
      icon={icon}
      expand={expand}
      expandId={expandId}
      expandAction={handleExpandAction}
    >
      <ErrorMessages errors={errors} />
      <Formik
        innerRef={refFormik}
        initialValues={initialFormState}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnBlur={false}
      >
        {() => (
          <>
            <Form onChange={handleFormChange} onKeyUp={handleOnKeyUp}>
              <Grid container spacing={2}>
                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <PasswordField
                        name="password"
                        label={t('current_password', { ns: 'profile_change_password' })}
                        inputProps={{ autoFocus: true }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <PasswordField
                        name="newpassword"
                        label={t('new_password', { ns: 'profile_change_password' })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>)}
                <Grid item xs={12} md={6}>
                  <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: 0, justifyContent: 'start' }}>
                    {
                      editMode
                        ? (
                          <>
                            <Button type="submit" disabled={!formChanged}>
                              {t('save', { ns: 'buttons' })}
                            </Button>
                            <Button onClick={onCancel}>
                              {t('cancel', { ns: 'buttons' })}
                            </Button>
                          </>
                        )
                        : (
                          <Button onClick={onEdit}>
                            {t('change_password', { ns: 'buttons' })}
                          </Button>
                        )
                    }
                  </DialogActions>
                </Grid>
              </Grid>
              <SubmitController
                name="ChangePassword"
                onFormChanged={handleFormChanged}
              />
            </Form>
          </>
        )}
      </Formik>
    </EditForm>
  );
};
