import React, { useState, useEffect, useRef } from 'react';
import { _, changeLocale } from '~/utils';
import { Formik, Form } from "formik";
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import EditForm from "~/components/EditForm";
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Observer from "~/utils/observer";
import { userService } from '~/http/services';
import { ErrorMessages } from '~/components/ErrorMessages';
import SubmitController from '~/components/formik/SubmitController';
import Select from '~/components/formik/Select';
import Switch from '~/components/formik/Switch';
import { useTranslation } from 'next-i18next';

export default ({ data, icon, expand, onProfileUpdate, expandAction, expandId }) => {
  const refFormik = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formChanged, setFormChanged] = useState(false);
  const [localeItems, setLocaleItems] = useState([]);
  const [initialFormState, setInitialFormState] = useState({
    allowNotifications: false,
  });

  const { t } = useTranslation([
    'buttons',
    'profile_main',
    'profile_preferences',
    'locale',
  ]);

  const router = useRouter();

  useEffect(() => {
    const { currencies, locales } = data;
    

    const localeItems = _.map(locales, (item, index) => ({
      id: index,
      name: `${item.locale} - ${t(item.locale, { ns: 'locale' })}`,
      locale: item.locale,
    }));
    const localeInitialValue = _.findIndex(localeItems, item => item.locale === data.locale);
    setLocaleItems(localeItems);

    setInitialFormState({
      localeIndex: localeInitialValue,
      allowNotifications: data.allownotifications,
    })
  }, [data]);

  useEffect(() => {
    if (!expand && editMode) {
      onCancel();
    }
  }, [expand]);

  const onSubmit = async (values, { setSubmitting }) => {
    const { localeIndex, allowNotifications } = values;
    const data = {
      locale: localeItems[localeIndex].locale,
      allownotifications: allowNotifications,
    };

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserProfile(data);

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

        const { locale } = data;
        changeLocale(locale, router);
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
    console.log('up');
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
      title={`${t('title', { ns: 'profile_preferences' })}`}
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
        onSubmit={onSubmit}
        enableReinitialize
        validateOnBlur={false}
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            <Form onChange={handleFormChange} onClick={!editMode ? (() => setEditMode(true)) : _.noop} onKeyUp={handleOnKeyUp}>
              <Grid container spacing={2}>
                
                <Grid item xs={12} md={6}>
                  <Select
                    name="localeIndex"
                    label={t('locale', { ns: 'profile_preferences' })}
                    onlyValues
                    onChange={(option) => {
                      const recordIndex = _.findIndex(localeItems, item => item.id === option.value);
                      setFieldValue("localeIndex", recordIndex)
                    }}
                    items={localeItems}
                  />
                </Grid>
                <Grid item xs={12} md={6}>

                </Grid>
                <Grid item xs={12} md={12}>
                  <Switch
                    name="allowNotifications"
                    label={t('allow_notifications', { ns: 'profile_preferences' })}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
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
          )
        }
        }
      </Formik>
    </EditForm>
  );
};
