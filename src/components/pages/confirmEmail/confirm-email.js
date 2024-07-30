import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import Link from '~/components/Link';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { userService } from '~/http/services';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TextField from '~/components/formik/TextField';
import SubmitController from '~/components/formik/SubmitController';
import { _, pushResponseMessages } from '~/utils';
import { FlexContainer } from '~/components/StyledComponents';

export default function ConfirmEmail(props) {

  const checkEmail = props?.data?.query?.e;
  const needSettings = props?.data?.query?.s !== 'no';
  const [initialValues, setInitialValues] = useState({});
  const [emailConfimedBefore, setEmailConfimedBefore] = useState();
  const [currentEmail, setCurrentEmail] = useState();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const { t } = useTranslation(['sidebar', 'buttons', 'confirm_email']);

  const validationSchema = yup.object({
    email: yup
      .string(t('email', { ns: 'confirm_email' }))
      .email(t('email_format', { ns: 'confirm_email' }))
      .required(t('email_required', { ns: 'confirm_email' })),
    code: yup
      .string(t('confirm_code', { ns: 'confirm_email' }))
      .required(t('confirm_code_is_required', { ns: 'confirm_email' })),
  });

  useEffect(() => {
    const getProfile = async () => {
      const getProfileResult = await userService.getUserProfile();
      if (getProfileResult.ok) {
        const { email, emailconfirmed } = getProfileResult.user;
        setEmailConfimedBefore(emailconfirmed);
        setCurrentEmail(email);
        if (!emailconfirmed) {
          const initialData = {
            email: checkEmail,
            code: '',
          };
          setInitialValues(initialData);
        }
      }
      setLoaded(true);
    }

    getProfile();
  }, []);

  const onSubmit = async (values, { setSubmitting }) => {
    const { email, code } = values;
    const confirmEmailRequest = await userService.confirmEmailAddress({
      emailconfirmid: code,
      email,
    });
    pushResponseMessages(confirmEmailRequest);

    if (confirmEmailRequest.ok) {
      const { SUCCESS_CODE } = confirmEmailRequest;

      if (SUCCESS_CODE === 'SUCCESS_EMAIL_CONFIRMED' || SUCCESS_CODE === 'EMAIL_CONFIRMED_BEFORE') {
        await userService.getUserProfile();
        router.push(needSettings ? '/user_settings' : '/');
      }
    }
  };

  const handleSendAgainEmail = async () => {
    const resendEmail = await userService.resendConfirmEmail();
    pushResponseMessages(resendEmail);

    if (resendEmail.ok && resendEmail.SUCCESS_CODE === 'SUCCESS_SENT_EMAIL') {
      const { confirmedEmail } = resendEmail;
      const initialData = {
        email: confirmedEmail,
        code: '',
      };
      setInitialValues(initialData);
    }

    if (resendEmail.error) {
      const { ERROR_CODE } = resendEmail;
      if (ERROR_CODE === 'CONFIRM_DUPLICATE') {
        router.push(needSettings ? '/user_settings' : '/');
      }
    }
  }

  if (!loaded) {
    return null;
  }

  return emailConfimedBefore
    ? (
      <FlexContainer column>
        <div style={{ fontSize: '15px' }}>
          <span>{t("your_email", { ns: "confirm_email" })}:</span>
          <span style={{ fontSize: '17px', color: 'green', marginLeft: '8px' }}>{currentEmail}</span>
        </div>
        <div style={{ marginTop: '24px' }}>
          <span>{t("email_confirmed_before", { ns: "confirm_email" })}</span>
        </div>
      </FlexContainer>
    )
    :
    (
      <div>
        <div style={{ textAlign: 'center', fontSize: '20px', height: '40px', borderBottom: '1px #d5d5d5 solid', marginBottom: '20px' }}>
          {t("confirm_email", { ns: "confirm_email" })}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnBlur={false}
        >
          {(props) => {
            return (
              <Form>
                <Grid conatainer>
                  <Grid item xs={12}>
                    <div style={{ padding: '0 8px' }}>
                      {t("confirm_text", { ns: "confirm_email" })}
                    </div>
                  </Grid>
                  <Grid itemm xs={12} style={{ margin: '16px 6px' }}>
                    <div style={{ maxWidth: '420px' }}>
                      <TextField
                        name="email"
                        label={t('email', { ns: 'confirm_email' })}
                        type="text"
                        disabled
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>
                  <Grid itemm xs={12} style={{ margin: '16px 6px' }}>
                    <div style={{ maxWidth: '420px' }}>
                      <TextField
                        name="code"
                        label={t('code', { ns: 'confirm_email' })}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>

                  <Grid style={{ marginTop: '40px', marginLeft: '6px' }}>
                    <Button
                      variant="outlined"
                      style={{ minWidth: '110px', marginRight: '16px', marginBottom: '16px' }}
                      onClick={handleSendAgainEmail}
                    >
                      {t('send_again', { ns: 'buttons' })}
                    </Button>
                    <Button
                      endIcon={<ArrowRightIcon />}
                      variant="contained"
                      color="success"
                      style={{ minWidth: '110px', marginBottom: '16px' }}
                      type="submit"
                    >
                      {t('confirm', { ns: 'buttons' })}
                    </Button>
                    <div style={{ marginTop: '32px', fontSize: '12px', maxWidth: '400px' }}>* {t('change_email', { ns: 'confirm_email' })} - <Link style={{ textDecoration: 'underline', color: '#085ebb' }} href="/profile?open=chLogin">{t('change', { ns: 'confirm_email' })}</Link> </div>
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </div>
    )
};
