import { connect } from '~/utils/shed';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import IconTile from '~/components/IconTile';
import { isBrowser, _ } from '~/utils';
import { IconListStyled } from './mainAdminPage.styled';
import adminPanelConfig from './adminPanel.config';
import { userService } from '~/http/services';

import { useTranslation } from 'next-i18next';
import User from '~/components/User';
import { ROLES } from '~/constants';

const MainAdminPage = (props) => {
  const { store } = props;
  const { sellerUpdateStatus } = store;

  const [roles, setRoles] = useState([]);
  const [currentSellerUpdateStatus, setCurrentSellerUpdateStatus] = useState(0);
  const [userLocked, setUserLocked] = useState(false);

  const { t } = useTranslation('sidebar', 'admin_main');

  useEffect(() => {
    setCurrentSellerUpdateStatus(sellerUpdateStatus);
  }, [sellerUpdateStatus]);

  useEffect(() => {
    userService.getUserProfile()
      .then((result) => {
        const userInfo = User.read();
        if (!_.isEmpty(userInfo)) {
          const { roles, locked } = userInfo;
          setRoles(roles);
          setUserLocked(locked);
        }
      });
  }, []);

  const getBadgeValue = (name) => {
    if (name === 'customerOrders') {
      return currentSellerUpdateStatus;
    }
  }

  const panelItems = isBrowser() && adminPanelConfig(t);

  return isBrowser() && (
    <div style={{ flexDirection: 'column', width: '100%' }}>
      <div style={{ paddingBottom: '26px', marginBottom: '24px', borderBottom: '3px #ceceed solid', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '30px' }}>{t('title', { ns: 'admin_main' })}</span>
      </div>
      <IconListStyled>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{ width: '100%', marginLeft: 0 }}>
          {
            _.map(panelItems, panelItem => {
              return roles.includes(panelItem.role) && (
                <Grid item xs={6} sm={4} md={3}>
                  <IconTile
                    href={panelItem.href}
                    label={panelItem.label}
                    icon={panelItem.icon}
                    badge={getBadgeValue(panelItem.name)}
                    userLocked={userLocked}
                    userLockedControl={panelItem.userLockedControl}
                    tooltipTitle={t('user_locked', { ns: 'admin_main' })}
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

export default connect(['sellerUpdateStatus'])(MainAdminPage);
