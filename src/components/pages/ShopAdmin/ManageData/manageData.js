import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import IconTile from '~/components/IconTile';
import { IconListStyled } from './manageData.styled';
import manageDataConfig from './manageData.config';
import { isBrowser, _ } from '~/utils';

import { useTranslation } from 'next-i18next';
import User from '~/components/User';
import { ROLES } from '~/constants';

const ManageDataPage = (props) => {
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation('sidebar', 'admin_main');

  useEffect(() => {
    const userInfo = User.read();
    if (userInfo) {
      const { roles } = userInfo;
      setRoles(roles);
    }
  }, []);

  const manageDataItems = isBrowser() ? manageDataConfig(t) : [];

  return isBrowser() && (
    <div style={{ flexDirection: 'column', width: '100%' }}>
      <div style={{ paddingBottom: '26px', marginBottom: '24px', borderBottom: '3px #ceceed solid', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '30px' }}>{t('manage_data', { ns: 'admin_main' })}</span>
      </div>
      <IconListStyled>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{ width: '100%', marginLeft: 0 }}>
          {
            _.map(manageDataItems, manageDataItem => {
              return roles.includes(manageDataItem.role) && (
                <Grid item xs={6} sm={4} md={3}>
                  <IconTile
                    href={manageDataItem.href}
                    label={manageDataItem.label}
                    icon={manageDataItem.icon}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </IconListStyled>
    </div>
  );
};

export default ManageDataPage;
