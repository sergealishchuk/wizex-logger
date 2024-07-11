import React, { useState, useEffect, useRef } from 'react';
import { _ } from '~/utils';
import { Formik, Form } from "formik";
import * as yup from 'yup';
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import EditForm from "~/components/EditForm";
import TextField from '~/components/formik/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Observer from "~/utils/observer";
import { userService } from '~/http/services';
import { ErrorMessages } from '~/components/ErrorMessages';
import SubmitController from '~/components/formik/SubmitController';
import { useTranslation } from 'next-i18next';

const phoneRegex = /^(\+?[0-9\s\-\(\)]{10,32})$/;

export default ({ data, icon, expand, onProfileUpdate, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const focusRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState({
    phone: '',
    contactemail: '',
  });
  const { t } = useTranslation(['buttons', 'profile_main', 'profile_contacts']);

  const validationSchema = yup.object().shape({
    phone: yup
      .string()
      .matches(phoneRegex, t('phone_validate', { ns: 'profile_contacts' })),
    contactemail: yup
      .string(t('enter_contact_email', { ns: 'profile_contacts' }))
      .email(t('contact_email_validate', { ns: 'profile_contacts' }))
      .required(t('contact_email_is_required', { ns: 'profile_contacts' })),
  });

  useEffect(() => {
    if (!expand && editMode) {
      onCancel();
    }
  }, [expand]);

  useEffect(() => {
    if (!_.isEmpty(data)) {
      setInitialFormState({
        ...data,
        phone: data.phone === null ? '' : data.phone
      });
    }
  }, [data]);

  useEffect(() => {
    if (editMode) {
      setTimeout(() => focusRef.current.focus(), 10);
    }
  }, [editMode]);


  const onSubmit = async (values, { setSubmitting }) => {

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserProfile(values);

    Observer.send('SpinnerShow', false);

    if (result && result.error) {
      const { error: { errors } } = result;
      setErrors(errors);
      setSubmitting(false);
    } else {
      if (result.ok) {
        enqueueSnackbar(t('profile_success_updated', { ns: 'profile_main' }), { variant: 'success' });
        const { data } = result;
        onProfileUpdate(data);
        setEditMode(false);
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
  };

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };

  return (
    <EditForm
      title={`${t('title', { ns: 'profile_contacts' })}`}
      onCollapse={handleOnCollapse}
      icon={icon}
      expand={expand}
      expandId={expandId}
      expandAction={expandAction}
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
          <Form onChange={handleFormChange} onClick={!editMode ? (() => setEditMode(true)) : _.noop} onKeyUp={handleOnKeyUp}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="contactemail"
                  label={t('contact_email', { ns: 'profile_contacts' })}
                  type="text"
                  disabled={!editMode}
                  required
                  inputRef={focusRef}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="phone"
                  label={t('phone', { ns: 'profile_contacts' })}
                  type="text"
                  disabled={!editMode}
                />
              </Grid>
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
                           {t('edit', { ns: 'buttons' })}
                        </Button>
                      )
                  }
                </DialogActions>
              </Grid>
            </Grid>
            <SubmitController name="Contacts" onFormChanged={handleFormChanged} />
          </Form>
        )}
      </Formik>
    </EditForm>
  );
};
