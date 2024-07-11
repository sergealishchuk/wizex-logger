import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '~/components/formik/TextField';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { userService } from '~/http/services';
import ErrorMessages from './ErrorMessages';
import PasswordField from '~/components/formik/PasswordField';
import store from '~/utils/store';
import { useTranslation } from 'next-i18next';
import User from '~/components/User';
import { changeLocale } from '~/utils';


export default function LoginPage(props) {
  const {
    children,
    onCloseAndOpenRegisterDialog,
    onCloseAndOpenResetPasswordDialog,
    onSuccessSignIn,
    ...rest
  } = props;

  const [closeDialog, setCloseDialog] = useState(false);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation(['sidebar']);
  const router = useRouter();

  const { openDialog: isOpen } = rest;

  const validationSchema = yup.object().shape({
    email: yup
      .string(t('auth.enter_your_email', { ns: 'sidebar' }))
      .email(t('auth.enter_valid_email', { ns: 'sidebar' }))
      .required(t('auth.email_is_required', { ns: 'sidebar' })),
    password: yup
      .string(t('auth.enter_password', { ns: 'sidebar' }))
      .required(t('auth.password_is_required', { ns: 'sidebar' })),
  });

  useEffect(() => {
    // const lastRegisteredEmail = store.get('lastRegisteredEmail');
    // if (lastRegisteredEmail) {
    //   setEmail(lastRegisteredEmail);
    // }
    // const emailFromLastRegistration = store.addListener('lastRegisteredEmail', value => setEmail(value));
    // return () => {
    //   store.removeListener(emailFromLastRegistration);
    // }
    if (User.userIsLoggedIn()) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setErrors([]);
    } else {
      if (onSuccessSignIn) {
        onSuccessSignIn.cb = _.noop;
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    setCloseDialog(true);
    setTimeout(() => setCloseDialog(false), 100);
  };

  const handleClearErrors = () => {
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    const { email } = values;
    const result = await userService.login(values);
    store.set('lastRegisteredEmail', email);

    if (result && result.error) {
      const { error: { errors } } = result;
      setErrors(errors);
    } else {
      const { firstname, locale } = result;
      enqueueSnackbar(`${t('auth.hello_str1', { ns: 'sidebar' })}${firstname}${t('auth.hello_str2', { ns: 'sidebar' })}`, { variant: 'success' });
      changeLocale(locale, router)
      router.push('/');
    }
  };

  const actions = (
    <>
      <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
        <Button type="submit">
          {t('auth.buttons.sign_in', { ns: 'sidebar' })}
        </Button>
      </DialogActions>
    </>
  );

  return User.isBrowser() && (User.userIsLoggedIn() === false) ? (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      
      <div style={{ maxWidth: '350px' }}>
        <Formik
          initialValues={{ email, password: '' }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnBlur={false}
        >
          {(props) => {
            return (
              <Form onChange={handleClearErrors}>
                <Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: '0 20px' }}>
                  <Grid item xs={12}>
                    <div style={{ borderBottom: '1px #e7e7e7 dotted', textAlign: 'center' }}>
                      <Image
                        priority
                        src="/img/cat-svgrepo-com.svg"
                        height={32}
                        width={32}
                        alt=""
                      />
                    </div>
                    <ErrorMessages errors={errors} />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={{ xs: 4 }}>
                      <Grid item xs={12}>
                        <TextField
                          name="email"
                          label={t('auth.email', { ns: 'sidebar', locale: 'uk' })}
                          type="text"
                          inputProps={{ autoFocus: !Boolean(email) }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <PasswordField
                          name="password"
                          label={t('auth.password', { ns: 'sidebar' })}
                          inputProps={{ autoFocus: Boolean(email) }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {actions}
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  ) : null
};

