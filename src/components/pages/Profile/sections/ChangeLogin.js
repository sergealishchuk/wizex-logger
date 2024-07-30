import React, { useState, useEffect, useRef } from 'react';
import { _, pushResponseMessages, getResponseMessage } from '~/utils';
import { Formik, Form } from "formik";
import * as yup from 'yup';
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import EditForm from "~/components/EditForm";
import { IconButton, Tooltip } from '@mui/material';
import TextField from '~/components/formik/TextField';
import DialogActions from '@mui/material/DialogActions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Button from '@mui/material/Button';
import Observer from "~/utils/observer";
import { userService } from '~/http/services';
import { ErrorMessages } from '~/components/ErrorMessages';
import PasswordField from '~/components/formik/PasswordField';
import SubmitController from '~/components/formik/SubmitController';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FlexContainer } from '~/components/StyledComponents';

export default ({ data, confirmed, icon, expand, onProfileUpdate, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const focusRef = useRef();
  const [editMode, setEditMode] = useState(true);
  const [errors, setErrors] = useState([]);
  const [shortScenario, setShortScenario] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState({
    email: '',
    password: '',
  });
  const [emailConfirmed, setEmailConfirmed] = useState(true);

  const { t } = useTranslation(['buttons', 'profile_main', 'profile_change_login']);

  const router = useRouter();

  const validationSchema = yup.object().shape({
    email: yup
      .string(t('enter_login_email', { ns: 'profile_change_login' }))
      .email(t('enter_valid_login_email', { ns: 'profile_change_login' }))
      .required(t('login_email_is_required', { ns: 'profile_change_login' })),
    password: yup
      .string(t('enter_current_password', { ns: 'profile_change_login' }))
      .min(6, t('current_password_validate', { ns: 'profile_change_login' }))
      .required(t('current_password_is_required', { ns: 'profile_change_login' })),
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
    if (!_.isEmpty(data)) {
      setInitialFormState({
        ...data,
        password: ''
      });
      setEmailConfirmed(confirmed);
    }
  }, [data, confirmed]);

  useEffect(() => {
    if (editMode) {
      setTimeout(() => {
        focusRef && focusRef.current && focusRef.current.focus()
      }, 10);
    }
  }, [editMode]);

  const onSubmit = async (values, { setSubmitting }) => {

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserProfile(values);

    Observer.send('SpinnerShow', false);

    if (result && result.error) {
      const message = getResponseMessage(result);
      if (message) {
        setErrors([{ message }]);
      }
      setSubmitting(false);
    } else {
      if (result.ok) {
        const { data } = result;
        onProfileUpdate(data);
        setEditMode(false);
        onCancel();
        enqueueSnackbar(t('profile_success_updated', { ns: 'profile_main' }), { variant: 'success' });
        const { email, emailconfirmed } = data;
        if (!emailconfirmed) {
          router.push(`/confirmemail?e=${email}&s=no`);
        }
      }
    }
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

  const handleOnKeyUp = (event) => {
    const { code } = event;
    if (code === 'Escape') {
      onCancel();
    }
  }

  const handleChangeLogin = (event) => {
    event.preventDefault();
    setEditMode(true);
  }

  const handleExpandAction = (expandId, expand, isUser) => {
    if (!expand && isUser) {
      setShortScenario(true);
    }
    return expandAction(expandId, expand, isUser);
  };

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };

  const handleConfirmEmail = () => {
    router.push(`/confirmemail?e=${data.email}`);
  };

  return (
    <EditForm
      title={<span style={{ color: emailConfirmed ? 'rgba(0, 0, 0, 0.87)' : 'brown' }}>{`${t('title', { ns: 'profile_change_login' })}`}</span>}
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
        {({ isSubmitting, dirty }) => (
          <>
            <Form onChange={handleFormChange} onKeyUp={handleOnKeyUp}>
              <Grid container spacing={2}>
                {editMode && (
                  <>
                    {!confirmed &&
                      <Grid item xs={12} md={12} style={{
                        marginTop: '-15px',
                        marginLeft: '15px',
                        color: 'brown',
                        fontSize: '12px',
                      }}>
                        {t('login_email_not_confirmed', { ns: 'profile_change_login' })}
                      </Grid>
                    }
                    <Grid item xs={12} md={12}>
                      <FlexContainer jc="flex-start" style={{ width: '100%' }}>
                        <div style={{ width: '100%' }}>
                          <TextField
                            name="email"
                            label={t('login_email', { ns: 'profile_change_login' })}
                            type="text"
                            disabled={!editMode}
                            required
                            inputRef={focusRef}
                            InputLabelProps={{ shrink: true }}
                          />
                        </div>
                        {
                          confirmed ?
                            <div style={{ marginLeft: '16px' }}>
                              <DoneAllIcon style={{ color: 'green' }} />
                            </div>
                            : <div style={{ marginLeft: '16px' }}>
                              <Tooltip title={t('confirm_email', { ns: 'profile_change_login' })}>
                                <IconButton style={{ marginTop: '-4px' }} onClick={handleConfirmEmail}>
                                  <ReadMoreIcon style={{ color: 'gray' }} />
                                </IconButton>
                              </Tooltip>
                            </div>
                        }
                      </FlexContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <PasswordField
                        name="password"
                        label={t('current_password', { ns: 'profile_change_login' })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>)}
                <Grid item xs={12} md={12}>
                  <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: 0, justifyContent: 'start' }}>
                    {
                      editMode
                        ? (
                          <>
                            <Button type="submit" disabled={!dirty || isSubmitting}>
                              {t('save', { ns: 'buttons' })}
                            </Button>
                            <Button onClick={onCancel}>
                              {t('cancel', { ns: 'buttons' })}
                            </Button>
                          </>
                        )
                        : (
                          <Button onClick={handleChangeLogin}>
                            {t('change_login', { ns: 'buttons' })}
                          </Button>
                        )
                    }
                  </DialogActions>
                </Grid>
              </Grid>
              <SubmitController
                name="changeLogin"
                onFormChanged={handleFormChanged}
              />
            </Form>
          </>
        )}
      </Formik>
    </EditForm>
  );
};
