// 

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import IconTile from '~/components/IconTile';
import { IconListStyled } from './system.styled';
import systemConfig from './system.config';
import { isBrowser, _ } from '~/utils';

import { useTranslation } from 'next-i18next';
import User from '~/components/User';
import { ROLES } from '~/constants';

const System = (props) => {
  
  const [roles, setRoles] = useState([]);
  const { t } = useTranslation('sidebar', 'admin_main');
  useEffect(() => {
    const userInfo = User.read();
    if (userInfo) {
      const { roles } = userInfo;
      setRoles(roles);
    }
  }, []);

  const systemItems = isBrowser() ? systemConfig(t) : [];

  return isBrowser() && (
    <div style={{ flexDirection: 'column', width: '100%' }}>
      <div style={{ paddingBottom: '26px', marginBottom: '24px', borderBottom: '3px #ceceed solid', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '30px' }}>{t('system', { ns: 'admin_main' })}</span>
      </div>
      <IconListStyled>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{ width: '100%', marginLeft: 0 }}>
          {
            _.map(systemItems, item => {
              return roles.includes(item.role) && (
                <Grid item xs={6} sm={4} md={3}>
                  <IconTile
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
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

export default System;
