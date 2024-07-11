import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import { Formik, Form } from 'formik';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { userService, goodsService } from '~/http/services';
import SubmitController from '~/components/formik/SubmitController';
import Observer from '~/utils/observer';
import { FlexContainer } from '~/components/StyledComponents';
import Switch from '~/components/formik/Switch';
import { pushResponseMessages, _ } from '~/utils';

import { ROLES } from '~/constants';


export default function UserSettings(props) {
  const { user: userRecord, onChange = _.noop } = props;

  const [initialValues, setInitialValues] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [currentUserId, setCurrentUserId] = useState();
  const [sellerHasOrders, setSellerHasOrders] = useState(false);
  const [access, setAccess] = useState(true);

  const { t } = useTranslation([
    'sidebar',
    'admin_users',
    'errors',
    'successes',
    'infos',
    'warnings',
  ]);

  const getSellerOrdersCount = async (sellerId) => {
    const parameters = {
      sellerId,
    };

    const orderCountResult = await goodsService.getSellerOrdersCount(parameters)
    pushResponseMessages(orderCountResult);
    const { ERROR_CODE } = orderCountResult;
    if (ERROR_CODE) {
      setAccess(false);
      return;
    }
    if (orderCountResult.ok) {
      const { count } = orderCountResult.data;
      setSellerHasOrders(count > 0);
    }
  };

  useEffect(() => {
    const userInfo = User.read();
    if (userInfo) {
      const { uid } = userInfo;
      setCurrentUserId(uid);
    }
    getSellerOrdersCount(userRecord.id);
  }, []);

  useEffect(() => {
    const { roles = [], locked } = userRecord;

    setInitialValues({
      user: roles.includes(ROLES.USER),
      seller: roles.includes(ROLES.SELLER),
      admin: roles.includes(ROLES.ADMIN),
      locked,
    });
  }, [userRecord]);

  const onSubmit = async (values, { setSubmitting }) => {
    const data = { userId: userRecord.id };
    const userRoles = [];
    _.each(['user', 'seller', 'admin'], (item => {
      if (values[item]) {
        userRoles.push(item);
      }
    }));

    if (!_.isEqual(userRoles, userRecord.roles)) {
      data.roles = userRoles;
    }

    if (values.locked !== userRecord.locked) {
      data.locked = values.locked;
    }

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserStatus(data);

    Observer.send('SpinnerShow', false);
    pushResponseMessages(result);

    const { ERROR_CODE } = result;
    if (ERROR_CODE) {
      setAccess(false);
    }

    if (result && result.error) {
      setSubmitting(false);
    } else {
      if (result.ok) {
        setSubmitting(true);
        onChange();
      }
    }
  };

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };

  const thisMineRecord = (userRecord.id === currentUserId);

  return access && (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnBlur={false}
      >
        {(props) => {
          return (
            <Form>
              <Grid conatainer>
                <Grid item md={12}>
                  <div style={{ padding: '16px' }}>
                    {t('user_settings', { ns: 'admin_users' })}
                  </div>
                </Grid>
                <Grid item md={6}>
                  <div style={{ maxWidth: '420px', padding: '0 16px' }}>
                    <FlexContainer jc="flex-start">
                      <div style={{ width: '74px', minWidth: '50px' }}>{t('roles', { ns: 'admin_users' })}:</div>
                      <FlexContainer jc="flex-start">
                        <Switch
                          name="user"
                          disabled
                          label="user"
                        />
                        <Switch
                          name="seller"
                          label="seller"
                          disabled={thisMineRecord || sellerHasOrders}
                        />
                        <Switch
                          name="admin"
                          label="admin"
                          disabled={thisMineRecord}
                        />
                      </FlexContainer>
                    </FlexContainer>
                  </div>
                </Grid>
                <Grid item md={6}>
                  <div style={{ maxWidth: '420px', padding: '0 16px' }}>
                    <Switch
                      name="locked"
                      label={t('locked', { ns: 'admin_users' })}
                      disabled={thisMineRecord}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} style={{ marginTop: '40px', marginLeft: '16px' }}>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="success"
                    style={{ padding: '5px 15px', color: 'white', minWidth: '110px', margin: '0 5px', fontSize: '10px' }}
                    type="submit"
                    disabled={!formChanged || thisMineRecord}
                  >
                    {t('save', { ns: 'buttons' })}
                  </Button>
                </Grid>
                {thisMineRecord && (
                  <Grid item xs={12}>
                    <span style={{ color: 'brown', fontSize: '11px', marginLeft: '16px' }}>{t('warning_edit_yourself', { ns: 'admin_users' })}</span>
                  </Grid>)
                }
              </Grid>
              <SubmitController name="AdminSettingForm" onFormChanged={handleFormChanged} />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
};
