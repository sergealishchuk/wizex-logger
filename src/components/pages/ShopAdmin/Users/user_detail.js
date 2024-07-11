import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { userService } from '~/http/services';
import { pushResponseMessages, getLocalDate, _ } from '~/utils';
import { GridUserStyled } from './users.styled';
import userFieldsList from './user_fields.config';
import UserSettings from './user_settings';


export default (props) => {
  const { userId } = props;
  const [dataLoaded, setDataLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [access, setAccess] = useState(false);

  const { t } = useTranslation([
    'sidebar',
    'buttons',
    'admin_users',
    'errors',
    'successes',
    'infos',
    'warnings',
  ]);

  const getUserDetail = async (userId) => {
    const parameters = {
      id: userId,
    };

    const result = await userService.getUsers(parameters);
    pushResponseMessages(result);

    const { ERROR_CODE } = result;
    if (ERROR_CODE) {
      setAccess(false);
      return;
    }
    if (result.ok) {
      setAccess(true);
      const { usersList } = result.data;
      if (usersList.length === 1) {
        setUser(usersList[0]);
      }
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    getUserDetail(userId);
  }, []);

  const userFields = userFieldsList(user, t);

  const handleUserSettings = () => {
    getUserDetail(userId);
  };

  return access && (
    <div>
      <div style={{ textAlign: 'center', fontSize: '20px', borderBottom: '2px #ceceed solid', padding: '8px', marginBottom: '16px' }}>
        {t('user_detail', { ns: 'admin_users' })}
      </div>
      <GridUserStyled container>
        {
          _.map(userFields, field => (
            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={3}>{field.title}:</Grid>
                <Grid item xs={9}>{field.value}</Grid>
              </Grid>
            </Grid>
          ))
        }
      </GridUserStyled>
      <UserSettings user={user} onChange={handleUserSettings} />
    </div>
  )
};
