import React, { useState, useEffect, useRef } from 'react';
import { _ } from '~/utils';
import { Formik, Form } from "formik";
import * as yup from 'yup';
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import EditForm from "~/components/EditForm";
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import User from "~/components/User";
import Observer from "~/utils/observer";
import { userService } from '~/http/services';
import { ErrorMessages } from '~/components/ErrorMessages';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { AlertDialog } from '../../../Dialog';
import PasswordField from '~/components/formik/PasswordField';
import SubmitController from '~/components/formik/SubmitController';
import { useTranslation } from 'next-i18next';
import SocketServer from '~/socket';

export default ({ icon, expand, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const focusRef = useRef();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const [shortScenario, setShortScenario] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [openConfirmRemoveAccountAlert, setOpenConfirmRemoveAccountAlert] = useState();
  const [initialFormState, setInitialFormState] = useState({
    password: '',
  });
  const { t } = useTranslation(['buttons', 'profile_main', 'profile_remove_account']);

  const validationSchema = yup.object().shape({
    password: yup
      .string(t('enter_current_password', { ns: 'profile_remove_account' }))
      .min(6, t('current_password_validate', { ns: 'profile_remove_account' }))
      .required(t('current_password_is_required', { ns: 'profile_remove_account' })),
  });

  useEffect(() => {
    if (!expand && editMode) {
      onCancel();
    }
    if (expand && shortScenario) {
      setEditMode(true);
    }
  }, [expand]);

  useEffect(() => {
    if (editMode && focusRef && focusRef.current) {
      setTimeout(() => focusRef.current.focus(), 10);
    }
  }, [editMode]);

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
  }

  const handleCloseRemoveAccountAlert = () => {
    setOpenConfirmRemoveAccountAlert(false);
  };

  const handleRemoveAccount = async (event) => {
    event.preventDefault();
    setOpenConfirmRemoveAccountAlert(false);
    const formik = refFormik.current;
    const { values } = formik;

    Observer.send('SpinnerShow', true);

    const result = await userService.removeUserAccount(values);

    Observer.send('SpinnerShow', false);

    if (result && result.error) {
      const { error: { errors } } = result;
      setErrors(errors);
    } else {
      if (result.ok) {
        enqueueSnackbar(t('profile_success_updated', { ns: 'profile_main' }), { variant: 'success' });
        setInitialFormState(values);
        setEditMode(false);
        setTimeout(() => {
          SocketServer.disconnect();
          User.clear();
          router.push('/');
        }, 1000);
      }
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
      title={`${t('title', { ns: 'profile_remove_account' })}`}
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
        enableReinitialize
        validateOnBlur={false}
      >
        {({ setSubmitting, isSubmitting, dirty, onSubmit, validateForm }) => (
          <>
            <Form onChange={handleFormChange} onKeyUp={handleOnKeyUp}>
              <Grid container spacing={2}>
                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                        <WarningAmberOutlinedIcon />
                        <span style={{ paddingLeft: '16px' }}>{t('warning_text', { ns: 'profile_remove_account' })}</span>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <PasswordField
                        name="password"
                        label={t('current_password', { ns: 'profile_remove_account' })}
                        inputRef={focusRef}
                      />
                    </Grid>
                  </>)}
                <Grid item xs={12} md={12}>
                  <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: 0, justifyContent: 'start' }}>
                    {
                      editMode
                        ? (
                          <>
                            <Button variant="outlined" color="error" disabled={!formChanged} onClick={async () => {
                              const res = await validateForm();
                              _.isEmpty(res) && setOpenConfirmRemoveAccountAlert(true);
                            }}>
                              {t('remove', { ns: 'buttons' })}
                            </Button>
                            <Button onClick={onCancel}>
                              {t('cancel', { ns: 'buttons' })}
                            </Button>
                          </>
                        )
                        : (
                          <Button onClick={onEdit}>
                            {t('remove_my_account', { ns: 'buttons' })}
                          </Button>
                        )
                    }
                  </DialogActions>
                </Grid>
              </Grid>
              <SubmitController
                name="RemoveMyAccount"
                onFormChanged={handleFormChanged}
                onSubmit={
                  async () => {
                    const res = await validateForm();
                    _.isEmpty(res) && setOpenConfirmRemoveAccountAlert(true);
                  }
                }
              />
            </Form>
            <AlertDialog
              title={
                <div style={{ color: 'red' }}>
                  {t('popup_title', { ns: 'profile_remove_account' })}
                </div>
              }
              text={
                <div style={{ color: 'red' }}>
                  <div>{t('popup_message', { ns: 'profile_remove_account' })}</div>
                </div>
              }
              open={openConfirmRemoveAccountAlert}
              handleClose={handleCloseRemoveAccountAlert}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Button variant="outlined" color="error" onClick={handleRemoveAccount}>{t('please_remove', { ns: 'buttons' })}</Button>
                <Button onClick={() => {
                  setOpenConfirmRemoveAccountAlert(false);
                  setSubmitting(false);
                }} autoFocus>
                  {t('cancel', { ns: 'buttons' })}
                </Button>
              </div>
            </AlertDialog>

          </>
        )}
      </Formik>
    </EditForm>
  );
};
