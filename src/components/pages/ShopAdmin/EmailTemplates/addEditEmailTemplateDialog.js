import { useState, useEffect, useRef } from "react";
import { adminService } from '~/http/services';
import IconButton from '@mui/material/IconButton';
import { _ } from '~/utils';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '~/components/Dialog';
import { useTranslation } from 'next-i18next';
import { Formik, Form } from 'formik';
import TextField from '~/components/formik/TextField';
import { ADD_MODE, EDIT_MODE } from "~/constants";
import { pushResponseMessages } from '~/utils';
import format from "html-format";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { FlexContainer } from "~/components/StyledComponents";

const IcButton = (props) => {
  const {
    onIcon,
    offIcon,
    value,
    onChange,
  } = props;
  const [currentValue, setCurrentValue] = useState(value);

  const handleClick = () => {
    const nextValue = !currentValue;
    setCurrentValue(nextValue);
    onChange(nextValue);
  };

  return (
    <IconButton style={{ padding: 0, margin: '2px', borderRadius: '3px', backgroundColor: '#afafaf' }} onClick={handleClick}>
      {currentValue ? onIcon : offIcon}
    </IconButton>
  );
}

export default function AddBlockEntityDialog(props) {
  const {
    mode,
    onCloseDialog = _.noop,
    onSubmited = _.noop,
    openDialog,
    currentId,
    onOpenView,
  } = props;

  if (!openDialog) {
    return null;
  }
  const [initialValues, setInitialValues] = useState({
    blockEntityName: '',
    blockDesc: '',
    type: '',
  });
  const [fullScreen, setFullScreen] = useState(false);

  const { t } = useTranslation(['sidebar', 'email_templates', 'buttons']);

  const refFormik = useRef(null);

  const validationSchema = yup.object().shape({
    name: yup
      .string(t('template_name', { ns: 'email_templates' }))
      .required(t('template_name_required', { ns: 'email_templates' }))
      .min(2, t('template_name_length', { ns: 'email_templates' }))
      .max(60, t('template_name_length', { ns: 'email_templates' })),
    subject: yup
      .string(t('template_subject', { ns: 'email_templates' }))
      .required(t('template_subject_required', { ns: 'email_templates' }))
      .min(2, t('template_subject_length', { ns: 'email_templates' }))
      .max(255, t('template_subject_length', { ns: 'email_templates' })),
    body: yup
      .string(t('template_body', { ns: 'email_templates' }))
      .required(t('template_body_required', { ns: 'email_templates' }))
      .min(2, t('template_body_length', { ns: 'email_templates' })),
    params: yup
      .string(t('template_params', { ns: 'email_templates' }))
      .test('params-check', t('params_format_json_error', { ns: 'email_templates' }), (params = '') => {
        let valid = true;
        if (params.trim().length > 0) {
          try {
            JSON.parse(params)
          } catch (e) {
            console.log(e);
            valid = false;
          }
        }
        return valid;
      })
  });

  const updateEmailTemplateRequest = async (values, close = true) => {
    const updateEmailTemplateResult = await adminService.updateEmailTemplate({
      ...values,
      id: currentId,
    });
    pushResponseMessages(updateEmailTemplateResult);

    if (updateEmailTemplateResult.ok) {
      const { nextTemplate } = updateEmailTemplateResult;
      setInitialValues(nextTemplate);
      onSubmited({ activeId: currentId });
      if (close) {
        onCloseDialog();
      }
    }
  };

  const addEmailTemplateRequest = async (values) => {
    const addEmailTemplateResult = await adminService.addEmailTemplate({
      ...values,
      addAfter: currentId,
    });
    pushResponseMessages(addEmailTemplateResult);
    if (addEmailTemplateResult.ok) {
      const { newEmailTemplate } = addEmailTemplateResult;
      onSubmited({ activeId: newEmailTemplate.newValue.id });
      onCloseDialog();
    }
  };

  const getEmailTemmplateRequest = async () => {
    const emailTemplateResult = await adminService.getEmailTemplate({
      id: currentId,
    });
    if (emailTemplateResult.ok) {
      const { name, subject, body, params } = emailTemplateResult.result;
      setInitialValues({
        name,
        subject,
        body,
        params,
      });
    }
  };

  useEffect(() => {
    if (openDialog) {
      if (mode === EDIT_MODE) {
        getEmailTemmplateRequest();
      } else if (mode === ADD_MODE) {
        setInitialValues({
          name: '',
          subject: '',
          body: '',
          params: '{}',
        });
      }
    }
  }, [openDialog]);

  const onSubmit = (values) => {
    const {
      name,
      subject,
      body,
      params,
    } = values;

    if (mode === ADD_MODE) {
      addEmailTemplateRequest({
        name,
        subject,
        body,
        params,
      });
    } else if (mode === EDIT_MODE) {
      updateEmailTemplateRequest({
        name,
        subject,
        body,
        params,
      });
    }
  };

  const handleClose = () => {
    onCloseDialog();
  };

  const handleFormat = () => {
    const { values, setFieldValue } = refFormik.current;
    const { body, params } = values;

    setFieldValue('body', format(body, "  ", 160));

    let templateParams = '{}';

    if (params.trim().length > 0) {
      try {
        templateParams = JSON.parse(params);
        templateParams = JSON.stringify(templateParams, null, 2);
        setFieldValue('params', templateParams);
      } catch (e) { }
    }
  };

  const handleSave = () => {
    const { submitForm } = refFormik.current;
    submitForm();
  }

  const handleOpenView = async (event) => {
    const { dirty, values } = refFormik.current;
    if (dirty) {
      const { name, subject, body, params } = values;
      await updateEmailTemplateRequest({
        name,
        subject,
        body,
        params,
      }, false);
    }

    onOpenView(event);
  };

  return (
    <Dialog
      title={t(mode === ADD_MODE ? 'add_email_template_title' : 'edit_email_template_title', { ns: 'email_templates' })}
      openDialog={openDialog}
      onClose={handleClose}
      width={640}
      fullScreen={fullScreen}
    >
      <div style={{ padding: '3px', position: 'sticky', top: '-16px', backgroundColor: '#e4e4e4', zIndex: 2 }}>
        <FlexContainer jc="space-between">
          <IcButton
            onIcon={<FullscreenExitIcon />}
            offIcon={<FullscreenIcon />}
            value={false}
            onChange={(state) => setFullScreen(state)}
          />
          <div>
            <Button onClick={handleOpenView}>View</Button>
            <Button onClick={handleFormat}>Format</Button>
            <Button type="submit" onClick={handleSave}>
              {t('save', { ns: 'buttons' })}
            </Button>
            <Button onClick={handleClose}>
              {t('cancel_close', { ns: 'buttons' })}
            </Button>
          </div>
        </FlexContainer>
      </div>
      <Formik
        innerRef={refFormik}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        enableReinitialize
      >
        {(props) => {
          return (
            <div style={{ marginTop: '30px' }}>
              <Form>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <Grid container spacing={{ xs: 4 }}>
                      <Grid item xs={12} style={{ paddingTop: '18px', marginBottom: '16px' }}>
                        <TextField
                          style={{ maxWidth: '350px' }}
                          name="name"
                          label={t("template_name", { ns: 'email_templates' })}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: '18px' }}>
                        <TextField
                          name="subject"
                          label={t("template_subject", { ns: 'email_templates' })}
                          type="text"
                          multiline
                          minRows={2}
                          maxRows={3}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: '18px' }}>
                        <TextField
                          name="body"
                          label={t("template_body", { ns: 'email_templates' })}
                          type="text"
                          multiline
                          minRows={2}
                          maxRows={228}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: '18px', marginBottom: '16px' }}>
                        <TextField
                          name="params"
                          label={t("template_params", { ns: 'email_templates' })}
                          type="text"
                          multiline
                          minRows={2}
                          maxRows={30}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </div>
          )
        }}
      </Formik>
    </Dialog>
  )
};
