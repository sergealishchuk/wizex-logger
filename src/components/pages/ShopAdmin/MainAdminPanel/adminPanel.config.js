import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { ROLES } from '~/constants';

export default (t) => ([
  {
    label: t('manage_data', { ns: 'admin_main' }),
    href: 'admin/manage_data',
    icon: <ManageHistoryIcon />,
    role: ROLES.ADMIN,
  },
  {
    label: t('users', { ns: 'admin_main' }),
    href: 'admin/users',
    icon: <PeopleOutlineIcon />,
    role: ROLES.ADMIN,
  },
  {
    label: t('articles', { ns: 'admin_main' }),
    href: 'admin/articles_panel',
    icon: <ArticleIcon />,
    role: ROLES.ADMIN,
  },
  {
    label: t('email_templates', { ns: 'admin_main' }),
    href: 'admin/email_templates_panel',
    icon: <MailOutlineIcon />,
    role: ROLES.ADMIN,
  },
]);
