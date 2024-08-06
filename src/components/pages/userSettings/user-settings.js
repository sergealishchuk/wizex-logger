import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import { Formik, Form } from 'formik';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { userService } from '~/http/services';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Select from '~/components/formik/Select';
import TextField from '~/components/formik/TextField';
import SubmitController from '~/components/formik/SubmitController';
import Observer from '~/utils/observer';
import Switch from '~/components/formik/Switch';
import { _, changeLocale, informDialog } from '~/utils';
import { init } from 'i18next';

const debounceFormChange = _.debounce((setFormChanged, value) => setFormChanged(value), 100);
export default function UserSettings(props) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});
  const [currencyCodeItems, setCurrencyCodeItems] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const [localeItems, setLocaleItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { t } = useTranslation(['sidebar', 'admin_main', 'currency', 'profile_main', 'locale']);

  const getUserProfile = async () => {
    const resultUserProfile = await userService.getUserProfile();

    if (resultUserProfile && resultUserProfile.error) {
      const { error: { errors } } = resultUserProfile;
    } else if (resultUserProfile.ok) {
      const { user: { currencies, currencyCodeBuyer, locale, locales, allownotifications, country, phone } } = resultUserProfile;
      setData({
        currencies,
        currencyCodeBuyer,
        locale,
        locales,
        allownotifications,
        country,
        phone,
      });

      setLoaded(true);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    const currencyCodeItems = _.map(data.currencies, (item, index) => ({
      id: index,
      name: `${item.symbol} ${item.currencyCode} - ${t(item.currencyCode, { ns: 'currency' })}`,
      currencyCode: item.currencyCode,
      symbol: item.symbol,
    }));

    let currencyCodeInitialValue;

    const currencyCode = _.get(data, 'currencyCodeBuyer');
    if (currencyCode) {
      currencyCodeInitialValue = _.findIndex(currencyCodeItems, item => item.currencyCode === currencyCode);
    }

    setCurrencyCodeItems(currencyCodeItems);
    if (!_.isEmpty(data)) {
      const localeItems = _.map(data.locales, (item, index) => ({
        id: index,
        name: `${item.locale} - ${t(item.locale, { ns: 'locale' })}`,
        locale: item.locale,
      }));
      const localeInitialValue = _.findIndex(localeItems, item => item.locale === data.locale);
      setLocaleItems(localeItems);
      const initialData = {
        currencyCodeIndex: currencyCodeInitialValue,
        localeIndex: localeInitialValue,
        phone: data.phone,
        allownotifications: data.allownotifications,
      };
      setInitialValues(initialData);
    }
  }, [data]);


  const onSubmit = async (values, { setSubmitting }) => {
    if (_.isEqual(values, initialValues)) {
      router.push('/');
      return;
    }
    const prevLocale = localeItems[initialValues.localeIndex].locale;

    const { currencyCodeIndex, localeIndex, allownotifications, phone } = values;
    const nextLocale = localeItems[localeIndex].locale;
    const data = {
      currencyCodeBuyer: currencyCodeItems[currencyCodeIndex].currencyCode,
      locale: nextLocale,
      allownotifications,
      phone,
    };

    Observer.send('SpinnerShow', true);

    const result = await userService.updateUserProfile(data);

    Observer.send('SpinnerShow', false);

    if (result && result.error) {
      const { error: { errors } } = result;
    } else {
      if (result.ok) {
        enqueueSnackbar(t('profile_success_updated', { ns: 'profile_main' }), { variant: 'success' });
        const { data } = result;
        const { currencyCodeBuyer, locale } = data;
        Currency.setCurrent(currencyCodeBuyer);
        router.push(`/`);
      }
    }
  };

  const handleLocaleChange = async (option, values, setFieldValue) => {

    const recordIndex = _.findIndex(localeItems, item => item.id === option.value);
    
    if (recordIndex > -1) {
      setFieldValue("localeIndex", recordIndex);

      const { currencyCodeIndex, allownotifications, phone } = values;
      const nextLocale = localeItems[recordIndex].locale;
      const data = {
        //currencyCodeBuyer: currencyCodeItems[currencyCodeIndex].currencyCode,
        locale: nextLocale,
        allownotifications,
        phone,
      };

      const result = await userService.updateUserProfile(data);

      if (result.ok) {
        changeLocale(nextLocale, router)
      }
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: '20px', height: '40px', borderBottom: '1px #d5d5d5 solid', marginBottom: '20px' }}>
        {t("user_settings", { ns: "admin_main" })}
      </div>
      {loaded &&
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnBlur={false}
        >
          {(props) => {
            const { values, setFieldValue } = props;

            return (
              <Form>
                <Grid conatainer>
                  
                  <Grid item xs={12} md={6} style={{ margin: '16px 6px' }}>
                    <div style={{ maxWidth: '420px' }}>
                      <Select
                        name="localeIndex"
                        label={t('locale', { ns: 'admin_main' })}
                        onlyValues
                        onChange={(option) => handleLocaleChange(option, values, setFieldValue)}
                        items={localeItems}
                      />
                    </div>
                  </Grid>
                  
                  <Grid style={{ marginTop: '40px', marginLeft: '6px' }}>
                    <Button
                      endIcon={<ArrowRightIcon />}
                      variant="contained"
                      color="success"
                      style={{ minWidth: '110px' }}
                      type="submit"
                    >
                      {t('continue', { ns: 'buttons' })}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      }
    </div>
  );
};
