import { getLocalDate } from '~/utils';

export default (user, t) => ([
  {
    title: 'Id',
    value: user.id,
  },
  {
    title: t('created', { ns: 'admin_users' }),
    value: getLocalDate(user.createdAt),
  },
  {
    title: t('name', { ns: 'admin_users' }),
    value: `${user.firstname} ${user.lastname}`,
  },
  {
    title: t('email', { ns: 'admin_users' }),
    value: user.email,
  },
  {
    title: t('phone', { ns: 'admin_users' }),
    value: user.phone,
  },
  {
    title: t('address', { ns: 'admin_users' }),
    value: user.adress,
  },
  {
    title: t('locale', { ns: 'admin_users' }),
    value: user.locale,
  },
  {
    title: t('country', { ns: 'admin_users' }),
    value: user.country,
  },
  {
    title: t('seller', { ns: 'admin_users' }),
    value: user.currencyCodeSeller,
  },
  {
    title: t('buyer', { ns: 'admin_users' }),
    value: user.currencyCodeBuyer,
  },
  {
    title: t('email_conf', { ns: 'admin_users' }),
    value: user.emailconfirmed ? 'Yes' : 'No',
  },
  {
    title: t('notifications', { ns: 'admin_users' }),
    value: user.allownotifications ? 'Yes' : 'No',
  },
  
  {
    title: t('status', { ns: 'admin_users' }),
    value: user.locked ? 'Locked' : 'Active',
  },
  {
    title: t('roles', { ns: 'admin_users' }),
    value: user.roles ? user.roles.join(', ') : '',
  }
]);
