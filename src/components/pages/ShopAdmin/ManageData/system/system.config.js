import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BarChartIcon from '@mui/icons-material/BarChart';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';


import { ROLES } from '~/constants';

export default (t) => ([
  {
    label: t('environment', { ns: 'admin_main' }),
    href: '/admin/manage_data/system/environments',
    icon: <AddToDriveIcon />,
    role: ROLES.ADMIN,
  }
]);
