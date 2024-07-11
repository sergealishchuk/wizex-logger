import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';

import { ROLES } from '~/constants';

export default (t) => ([
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
    label: t('manage_data', { ns: 'admin_main' }),
    href: 'admin/manage_data',
    icon: <ManageHistoryIcon />,
    role: ROLES.ADMIN,
  },
]);
