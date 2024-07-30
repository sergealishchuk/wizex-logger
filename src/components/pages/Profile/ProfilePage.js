import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import Link from "next/link";
import User from "~/components/User";
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { SmallButton } from '../../StyledComponents';
import { useTranslation } from 'next-i18next';

import {
  PersonalData,
  Contacts,
  ChangeLogin,
  ChangePassword,
  Preferences,
  RemoveMyAccount,
} from './sections';
import { ErrorMessages } from '~/components/ErrorMessages';
import { AlertDialog } from '../../Dialog';
import SocketServer from "~/socket";
import { userService } from '~/http/services';
import { userSocketService } from "~/socket/services";

const ButtonsBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  marginLeft: '-26px',
  flexDirection: 'column',
}));

export default function Profile(props) {
  const { data: { query = {} } } = props;
  const openChapter = {};
  if (query?.open) {
    openChapter[query.open] = true;
  }
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);
  const [openConfirmLogOutAlert, setOpenConfirmLogOutAlert] = useState(false);
  const [disableCollapseAll, setDisableCollapseAll] = useState(false);
  const [disableExpandAll, setDisableExpandAll] = useState(false);
  const { t } = useTranslation(['errors', 'buttons', 'sidebar', 'profile_main']);

  const [expandSections, setExpandSections] = useState({
    personalData: false,
    contacts: false,
    address: false,
    chLogin: openChapter['chLogin'] ? true : false,
    chPassword: false,
    preferences: false,
    removeAccount: false,
  });
  const router = useRouter();

  const logoutRequest = async () => {
    const result = await userService.logout();
    if (result && result.ok) {
      await userSocketService.logoutUser();
      User.clear();
      SocketServer.disconnect();
      router.push('/');
    } else {
      console.error(result);
    }
  };

  useEffect(() => {
    const sections = _.keys(expandSections).length;
    const opened = _.reduce(expandSections, (result, value) => {
      return result + (value ? 1 : 0);
    });

    if (opened === 0) {
      setDisableCollapseAll(true);
      setDisableExpandAll(false);
    } else if (sections === opened) {
      setDisableCollapseAll(false);
      setDisableExpandAll(true);
    } else {
      setDisableCollapseAll(false);
      setDisableExpandAll(false);
    }
  }, [expandSections]);

  useEffect(() => {
    const getProfile = async () => {
      const result = await userService.getUserProfile();

      if (result && result.error) {
        const { error: { errors } } = result;
        setErrors(errors);
      } else {
        if (result.ok) {
          setData(result.user);
        }
      }
    };
    getProfile();
  }, []);

  const handleCloseAlertLogOut = () => {
    setOpenConfirmLogOutAlert(false);
  }

  const handleLogOut = (event) => {
    event.preventDefault();
    logoutRequest();
  };

  const handleCollapseAll = () => {
    const nextExpandState = { ...expandSections };
    _.forEach(nextExpandState, (value, key) => {
      nextExpandState[key] = false;
    });
    setExpandSections(nextExpandState);
  };

  const handleExpandAll = () => {
    const nextExpandState = { ...expandSections };
    _.each(nextExpandState, (value, key) => {
      nextExpandState[key] = true;
    });
    setExpandSections(nextExpandState);
  };

  const handleUpdateProfile = (data) => {
    setData(data);
  };

  const handleExpandAction = (value, expand) => {
    const nextExpandSections = { ...expandSections };
    nextExpandSections[value] = !expand;
    setExpandSections(nextExpandSections);
  }

  return (
    <>
      <div style={{ paddingBottom: '0', marginBottom: '24px', borderBottom: '3px #ceceed solid', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '30px' }}>{`${t('my_account', { ns: 'profile_main' })}`}</span>
        <div style={{ marginTop: '20px', display: 'flex', alignSelf: 'flex-end' }}>
          <SmallButton disabled={disableCollapseAll} onClick={handleCollapseAll}>{`${t('collapse_all', { ns: 'profile_main' })}`}</SmallButton>
          <SmallButton disabled={disableExpandAll} onClick={handleExpandAll}>{`${t('expand_all', { ns: 'profile_main' })}`}</SmallButton>
        </div>
      </div>

      <ErrorMessages errors={errors} />
      <PersonalData
        expandId='personalData'
        expand={expandSections.personalData}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<AccountCircleIcon />}
        data={_.pick(data, ['firstname', 'lastname'])}
      />
      <Contacts
        expandId='contacts'
        expand={expandSections.contacts}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<ContactMailIcon />}
        data={_.pick(data, ['contactemail', 'phone'])}
      />
      <ChangeLogin
        expandId='chLogin'
        expand={expandSections.chLogin}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<AlternateEmailIcon />}
        confirmed={data.emailconfirmed}
        data={_.pick(data, ['email'])}
      />
      <ChangePassword
        expandId='chPassword'
        expand={expandSections.chPassword}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<PasswordIcon />}
        data={_.pick(data, ['email'])}
      />
      <Preferences
        expandId='preferences'
        expand={expandSections.preferences}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<RoomPreferencesIcon />}
        data={_.pick(data, ['currencyCodeBuyer', 'locale', 'currencies', 'locales', 'allownotifications'])}
      />
      <RemoveMyAccount
        expandId='removeAccount'
        expand={expandSections.removeAccount}
        expandAction={handleExpandAction}
        onProfileUpdate={handleUpdateProfile}
        icon={<DeleteForeverOutlinedIcon />}
      />
    </>
  );
};
