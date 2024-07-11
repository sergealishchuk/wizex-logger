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
import { BoxStyled, TemplatesTable } from './elasticSearch.styled';
import { _ } from '~/utils';

export default function ElasticSearchPage(props) {
  const [loaded, setLoaded] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [templatesList, setTemplatesList] = useState([]);

  const { t } = useTranslation(['sidebar', 'admin_main']);

  const { locale } = useRouter();

  const refreshTemplatesRequest = async (values) => {
    const refreshTemplates = await adminService.refreshSearchTemplates(values);
    const { SUCCESS_CODE } = refreshTemplates;
    
    if (SUCCESS_CODE === 'SUCCESS_REFRESH_DATABASE') {
      //Observer.send('OpenSignInDialog');
    }

    getAllTemplatesRequest();
  }

  const getAllTemplatesRequest = async (values) => {
    const allTemplates = await adminService.getAllTemplates(values);
    const { needRefresh, templatesList } = allTemplates;
    setNeedRefresh(needRefresh);
    setTemplatesList(templatesList);

  }

  useEffect(() => {
    setLoaded(true);
    getAllTemplatesRequest();
  }, []);

  const handleRefrashTemplates = () => {
    refreshTemplatesRequest();
    console.log('handleRefrashTemplates');
  };

  const handleRefrash = () => {
    getAllTemplatesRequest();
  };

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: '20px', borderBottom: '2px #ceceed solid', padding: '8px', marginBottom: '16px' }}>
        {t("script_templates", { ns: "admin_main" })}
      </div>
      {loaded &&
        <Grid container>
          <Grid item xs={12} md={6}>
            <BoxStyled column ai="flex-start" jc="space-between">
              <span className="box-label">Templates</span>

              <TemplatesTable>
                {
                  _.map(templatesList, item => {

                    return (
                      <tr>
                        <td >{item.name}</td>
                        <td>{item.exists ? <span>Exists</span> : <span>Not exists</span>}</td>
                        <td>{item.changed ? <span style={{color: 'red'}}>Changed</span> : <span>Saved</span>}</td>
                        <td>
                          <ul>
                            {
                              _.map(item.params, param => {
                                return (
                                  <li>{param.name} : {param.type}</li>
                                )
                              })
                            }
                          </ul>
                        </td>
                      </tr>

                    )
                  })
                }
              </TemplatesTable>

              <Button
                variant="contained"
                disabled={!needRefresh}
                startIcon={<RefreshIcon style={{ fontSize: '11px', marginLeft: 'auto' }} />}
                style={{ fontSize: '11px', height: '24px', marginBottom: '24px' }}
                onClick={handleRefrashTemplates}
              >
                {t('refresh_templates', { ns: 'buttons' })}
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon style={{ fontSize: '11px', marginLeft: 'auto' }} />}
                style={{ fontSize: '11px', height: '24px', marginBottom: '24px' }}
                onClick={handleRefrash}
              >
                {t('refresh', { ns: 'buttons' })}
              </Button>
            </BoxStyled>
          </Grid>
          <Grid item xs={12} md={6}>
            <BoxStyled column ai="flex-start" jc="space-between">
              <span className="box-label">Statistic</span>
            </BoxStyled>
          </Grid>
        </Grid>
      }
    </div>
  );
};
