import React, { useState, useEffect, useRef } from 'react';
import { _, confirmDialog, pushResponseMessages } from '~/utils';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import { Formik, Form } from "formik";
import * as yup from 'yup';
const { FlexContainer, SmallButton } = require("~/components/StyledComponents")
import { useTranslation } from 'next-i18next';
import Grid from "@mui/material/Grid";
import TextField from '~/components/formik/TextField';
import { DIALOG_ACTIONS } from '~/constants';
import { projectsService } from '~/http/services';

const PartnersList = (props) => {
  const { project = {}} = props;
  const refFormik = useRef(null);
  const [partners, setPartners] = useState(project.partnersList || []);
  const [initialFormState, setInitialFormState] = useState({ email: '' });

  const { t } = useTranslation(['buttons', 'profile_main', 'profile_contacts']);

  const validationSchema = yup.object().shape({
    email: yup
      .string(t('enter_contact_email', { ns: 'profile_contacts' }))
      .email(t('contact_email_validate', { ns: 'profile_contacts' }))
      .required(t('contact_email_is_required', { ns: 'profile_contacts' })),
  });

  // useEffect(() => {
  //   getPartnersList();
  // }, []);

  const getPartnersList = async () => {
    const getPartnersListRequest = await projectsService.getProjectPartners({
      projectId: project.id,
    });
    if (getPartnersListRequest.ok) {
      const { partnersList } = getPartnersListRequest;
      setPartners(partnersList);
    }

  }

  const onSubmit = async (values) => {
    const { email } = values;
    const exist = _.find(partners, item => item.email === email);
    if (exist) {
      alert('partner exist');
      return;
    }
    const maxId = Math.max.apply(null, partners.map(item => item.id));
    setPartners([...partners, {
      id: maxId + 1,
      name: 'user name',
      email,
    }]);

    const addPartnerRequest = await projectsService.addPartner({
      ...values,
      projectId: project.id,
    });
    pushResponseMessages(addPartnerRequest);
    if (addPartnerRequest.ok) {
      getPartnersList();
    }


    refFormik.current.resetForm();
  };

  const handleRemovePartner = async (partner) => {
    const confirm = await confirmDialog({
      text: `Do you want to delete "${partner.name}" as your partners list?`,
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      // const nextPartners = [...partners];
      // _.remove(nextPartners, item => item.id === partner.id);
      // setPartners(nextPartners);
      const removePartnerFromProjectRequest = await projectsService.removePartnerFromProject({
        partnerId: partner.id,
        projectId: project.id, 
      });
      pushResponseMessages(removePartnerFromProjectRequest);
      if (removePartnerFromProjectRequest.ok) {
        getPartnersList();
      }

    }
  };

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Partners List</div>
      {partners.length > 0
        ? <div style={{ borderTop: '1px #eee solid', marginTop: '8px', padding: '8px' }}>
          {
            partners.map(partner => {
              return (
                <FlexContainer jc="space-between" key={partner.email}>
                  <div>
                    <div>{partner.name}</div>
                    <div style={{ fontSize: '10px' }}>{partner.email}</div>
                  </div>
                  <IconButton onClick={() => handleRemovePartner(partner)}>
                    <span>
                      <DeleteForeverIcon style={{ margin: '0 6px', fontSize: '18px', color: 'brown' }} />
                    </span>
                  </IconButton>
                </FlexContainer>
              )
            })
          }
        </div>
        : null
      }

      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px #eee solid' }}>
        <Formik
          innerRef={refFormik}
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnBlur={false}
        >
          {() => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    name="email"
                    label={t('email', { ns: 'profile_contacts' })}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <SmallButton style={{ marginTop: '7px' }} btn="blue" type="submit">Add Partner</SmallButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
};

export default PartnersList;
