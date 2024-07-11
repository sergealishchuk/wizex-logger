import { useState, useEffect } from "react";
import { adminService } from '~/http/services';
import { _ } from '~/utils';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '~/components/Dialog';
import { useTranslation } from 'next-i18next';
import { Formik, Form } from 'formik';
import TextField from '~/components/formik/TextField';
import { ErrorMessages } from '~/components/ErrorMessages';
import { ADD_MODE, EDIT_MODE } from "~/constants";
import { pushResponseMessages } from '~/utils';

export default function AddEditTagDialog(props) {

  const {
    mode,
    onCloseDialog = _.noop,
    onSubmited = _.noop,
    openDialog,
    currentValueId,
  } = props;
  if (!openDialog) {
    return null;
  }
  const [errors, setErrors] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
  });

  const { t } = useTranslation(['sidebar', 'articles', 'buttons']);
  const router = useRouter();

  const validationSchema = yup.object().shape({
    name: yup
      .string(t('attribute_name_uk', { ns: 'articles' }))
      .required(t('attribute_name_uk_required', { ns: 'articles' }))
      .min(2, t('attribute_min_length', { ns: 'articles' }))
      .max(60, t('attribute_min_length', { ns: 'articles' })),
  });

  const updateArticleTagRequest = async (values) => {
    const updateAttributeResult = await adminService.updateArticleTagValue({
      ...values,
      valueId: currentValueId,
    });

    pushResponseMessages(updateAttributeResult);

    if (updateAttributeResult.ok) {
      onSubmited({ activeId: currentValueId });
      onCloseDialog();
    }
  };


  const addArticleTagValueRequest = async (values) => {
    const addAttributeValueResult = await adminService.addArticleTagValue({
      ...values,
      addAfter: currentValueId,
    });

    pushResponseMessages(addAttributeValueResult);

    if (addAttributeValueResult.ok) {
      const { newValue } = addAttributeValueResult.result;
      onSubmited({ activeId: newValue.id });
      onCloseDialog();
    }
  };

  const getTagRequest = async () => {
    const tagResult = await adminService.getArticlesTagValue({
      valueId: currentValueId,
    });
    if (tagResult.ok) {
      const {
        name,
      } = tagResult.result;
      setInitialValues({
        name,
      });
    }
  };

  useEffect(() => {
    if (openDialog) {
      if (mode === EDIT_MODE) {
        getTagRequest(1);
      } else if (mode === ADD_MODE) {
        setInitialValues({
          name: '',
        });
      }
    }
  }, [openDialog]);

  const handleClearErrors = () => {

  };

  const onSubmit = (values) => {
    if (mode === ADD_MODE) {
      addArticleTagValueRequest(values);
    } else if (mode === EDIT_MODE) {
      updateArticleTagRequest(values);
    }
  };

  const handleClose = () => {
    onCloseDialog();
  };

  return (
    <Dialog
      title={t(mode === ADD_MODE ? 'add_attribute_value' : 'edit_attribute_value', { ns: 'articles' })}
      openDialog={openDialog}
      onClose={handleClose}
      width={640}
    >
      <ErrorMessages errors={errors} />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        enableReinitialize
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            <div style={{ marginTop: '30px' }}>
              <Form onChange={handleClearErrors}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <Grid container spacing={{ xs: 4 }}>
                      <Grid item xs={12} style={{ paddingTop: '8px' }}>
                        <TextField
                          style={{ maxWidth: '570px' }}
                          name="name"
                          label={t('attribute_value_uk', { ns: 'articles' })}
                          type="text"
                          inputProps={{ autoFocus: true }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{ marginLeft: '16px' }}>
                    <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
                      <Button onClick={handleClose}>
                        {t('cancel_close', { ns: 'buttons' })}
                      </Button>
                      <Button type="submit">
                        {t('save', { ns: 'buttons' })}
                      </Button>
                    </DialogActions>
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
