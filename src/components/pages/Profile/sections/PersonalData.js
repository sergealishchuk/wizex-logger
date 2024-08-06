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

export default ({ data, icon, expand, onProfileUpdate, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const nameRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormState, setInitialFormState] = useState({
    firstname: '',
    lastname: '',
  });
  const { t } = useTranslation(['buttons', 'profile_main', 'profile_personal_data']);

  const validationSchema = yup.object({
    firstname: yup
      .string(t('enter_first_name', { ns: 'profile_personal_data' }))
        .min(2, t('first_name_validate', { ns: 'profile_personal_data' }))
        .required(t('first_name_is_required', { ns: 'profile_personal_data' })),
        lastname: yup
          .string(t('enter_last_name', { ns: 'profile_personal_data' }))
          .min(2, ('last_name_validate', { ns: 'profile_personal_data' }))
          .required(t('last_name_is_required', { ns: 'profile_personal_data' })),
  });

  useEffect(() => {
    if (!_.isEmpty(data)) {
      setInitialFormState(data);
    }
  }, [data]);

  useEffect(() => {
    if (!expand && editMode) {
      onCancel();
    }
  }, [expand]);

  useEffect(() => {
    if (editMode) {
      setTimeout(() => nameRef.current.focus(), 10);
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
  };

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
      title={`${t('title', { ns: 'profile_personal_data' })}`}
      icon={icon}
      onCollapse={handleOnCollapse}
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
          <>
            <Form onChange={handleFormChange} onClick={!editMode ? (() => setEditMode(true)) : _.noop} onKeyUp={handleOnKeyUp}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="firstname"
                    label={`${t('first_name', { ns: 'profile_personal_data' })}`}
                    type="text"
                    disabled={!editMode}
                    required
                    inputRef={nameRef}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="lastname"
                    label={`${t('last_name', { ns: 'profile_personal_data' })}`}
                    type="text"
                    disabled={!editMode}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: 0, justifyContent: 'start' }}>
                    {
                      editMode
                        ? (
                          <>
                            <Button type="submit" disabled={!formChanged}>
                              {`${t('save', { ns: 'buttons' })}`}
                            </Button>
                            <Button onClick={onCancel}>
                              {`${t('cancel', { ns: 'buttons' })}`}
                            </Button>
                          </>
                        )
                        : (
                          <Button onClick={onEdit}>
                            {`${t('edit', { ns: 'buttons' })}`}
                          </Button>
                        )
                    }
                  </DialogActions>
                </Grid>
              </Grid>
              <SubmitController name="PersonalData" onFormChanged={handleFormChanged} />
            </Form>
          </>
        )}
      </Formik>
    </EditForm>
  );
};
