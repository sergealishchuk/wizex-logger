import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BarChartIcon from '@mui/icons-material/BarChart';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';


import { ROLES } from '~/constants';

export default (t) => ([
  {
    label: t('dummy_data', { ns: 'admin_main' }),
    href: '/admin/manage_data/dummy',
    icon: <AddToDriveIcon />,
    role: ROLES.ADMIN,
  },
  {
    name: 'customerOrders',
    label: t('data_statistic', { ns: 'admin_main' }),
    href: '/admin/manage_data/statistic',
    icon: <BarChartIcon />,
    role: ROLES.ADMIN,
  },
  {
    name: 'elasticSearchPage',
    label: t('elastic_search', { ns: 'admin_main' }),
    href: '/admin/manage_data/elastic_search',
    icon: <TroubleshootIcon />,
    role: ROLES.ADMIN,
  },
  {
    name: 'SYSTEM',
    label: t('system', { ns: 'admin_main' }),
    href: '/admin/manage_data/system',
    icon: <SettingsSuggestIcon />,
    role: ROLES.ADMIN,
  },
]);
