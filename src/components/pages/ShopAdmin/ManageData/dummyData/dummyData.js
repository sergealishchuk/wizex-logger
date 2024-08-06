import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { adminService } from '~/http/services';
import RefreshIcon from '@mui/icons-material/Refresh';
import Observer from '~/utils/observer';
import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FlexContainer } from '~/components/StyledComponents';
import { TextField } from "@mui/material";
import { BoxStyled } from './dummyData.styled';
import { pushResponseMessages } from '~/utils'

export default function DummyDataPage(props) {
  const [loaded, setLoaded] = useState(false);
  const [countProducts, setCountProducts] = useState();
  const [indexCount, setIndexCount] = useState();
  const [productCountValue, setProductCountValue] = useState(5000);
  const [indexProducts, setIndexProducts] = useState(true);

  const { t } = useTranslation(['sidebar', 'admin_main']);

  const { locale } = useRouter();

  const getDataStatistics = async () => {
    const dataStatisticsResult = await adminService.getDataStatistics();

    const { error, code } = dataStatisticsResult;
    if (error || (code && code === 'TOKEN_IS_EXPIRED')) {
      Observer.send('OpenSignInDialog');
    } else {

      const { goods, indexCount } = dataStatisticsResult;
      setIndexCount(indexCount);
      setCountProducts(goods.ProductCount);
    }
  };

  const refreshDatabaseRequest = async (values) => {
    Observer.send('SpinnerShow', true);
    const refreshDatabase = await adminService.refreshDatabase(values);
    Observer.send('SpinnerShow', false);
    const { SUCCESS_CODE } = refreshDatabase;
    if (SUCCESS_CODE === 'SUCCESS_REFRESH_DATABASE') {
      Observer.send('OpenSignInDialog');
    }
  }

  const populateDummyDataRequest = async (values) => {
    Observer.send('SpinnerShow', true);
    const populateDummyResult = await adminService.populateDummyData(values);
    Observer.send('SpinnerShow', false);
    pushResponseMessages(populateDummyResult);
  };

  const startIndexerForProductsRequest = async (values) => {
    return await adminService.startIndexerForProducts(values);
  };

  useEffect(() => {
    setLoaded(true);
    getDataStatistics();
  }, []);

  const handlePopulateDummyData = async () => {
    if (productCountValue > 0) {
      Observer.send('SpinnerShow', true);
      await populateDummyDataRequest({
        count: productCountValue,
        locale,
      });
      if (indexProducts) {
        await startIndexerForProductsRequest();
      }
      await getDataStatistics();
      Observer.send('SpinnerShow', false);
    }
  }

  const handleChangeProductCount = (event) => {
    const value = event.target.value;
    setProductCountValue(Number(value));
  };

  const handleStartIndexerForProducts = async () => {
    Observer.send('SpinnerShow', true);
    const indexerResult = await startIndexerForProductsRequest();

    await getDataStatistics();
    Observer.send('SpinnerShow', false);
    pushResponseMessages(indexerResult);
  };

  const handleSetIndexProducts = () => {
    setIndexProducts(!indexProducts);
  };

  const handleRefrashDatabase = () => {
    refreshDatabaseRequest();
  };

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: '20px', borderBottom: '2px #ceceed solid', padding: '8px', marginBottom: '16px' }}>
        {t("dummy_data", { ns: "admin_main" })}
      </div>
      {loaded &&
        <Grid container>
          <Grid item xs={12} md={6}>
            <BoxStyled column ai="flex-start" jc="space-between">
              <span className="box-label">Products</span>
              <Button
                variant="contained"
                startIcon={<RefreshIcon style={{ fontSize: '11px', marginLeft: 'auto' }} />}
                style={{ fontSize: '11px', height: '24px', marginBottom: '24px' }}
                onClick={handleRefrashDatabase}
              >
                {t('refresh_database', { ns: 'buttons' })}
              </Button>


              <div style={{ marginBottom: 0 }}>
                Count: {countProducts}
              </div>
              <div>
                Locale: {locale}
              </div>
              <TextField
                label="add"
                size="small"
                type="number"
                value={productCountValue > 0 ? productCountValue : ''}
                onChange={handleChangeProductCount}
              />
              <FormControlLabel
                className="unselect"
                control={
                  <Checkbox
                    defaultChecked={indexProducts}
                    onChange={handleSetIndexProducts}
                  />
                }
                label="Populate & Create/Update Indexes"
              />

              <FlexContainer>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon style={{ fontSize: '11px', marginLeft: 'auto' }} />}
                  style={{ fontSize: '11px', height: '24px' }}
                  onClick={handlePopulateDummyData}
                >
                  {t('populate_products', { ns: 'buttons' })}
                </Button>
              </FlexContainer>
            </BoxStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <BoxStyled column ai="flex-start" jc="space-between">
              <span className="box-label">Indexes</span>
              <div>
                Count: {indexCount}
              </div>
              <Button
                variant="contained"
                startIcon={<RefreshIcon style={{ fontSize: '11px', marginLeft: 'auto' }} />}
                style={{ fontSize: '11px', height: '19px' }}
                onClick={handleStartIndexerForProducts}
              >
                {t('index_data', { ns: 'buttons' })}
              </Button>
            </BoxStyled>
          </Grid>
        </Grid>
      }
    </div>
  );
};
