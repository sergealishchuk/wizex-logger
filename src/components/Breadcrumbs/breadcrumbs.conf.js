import { _ } from '~/utils';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonitorIcon from '@mui/icons-material/Monitor';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ExtensionIcon from '@mui/icons-material/Extension';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

const getBcList = (t, locale) => ({
	"/": [{
		label: t('bc.home', { ns: 'sidebar' }),
		icon: < HomeIcon fontSize="small" />,
	}],
	
	'/profile': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.my_account', { ns: 'sidebar' }),
		}
	]),
	'/projects': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.projects', { ns: 'sidebar' }),
		}
	]),
	'/projects/actions/[ProjectId]': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.projects', { ns: 'sidebar' }),
			href: "/projects",
			component: "a",
			icon: <AccountTreeIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: params.name,
		}
	]),
	'/projects/edit/[projectId]': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.projects', { ns: 'sidebar' }),
			href: "/projects",
			component: "a",
			icon: <AccountTreeIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: t('bc.edit', { ns: 'sidebar' }),
		}
	]),
	'/projects/new': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.projects', { ns: 'sidebar' }),
			href: "/projects",
			component: "a",
			icon: <AccountTreeIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: t('bc.new_project', { ns: 'sidebar' }),
		}
	]),
	'/projects/action-detail/[actionId]': (params = {}) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.projects', { ns: 'sidebar' }),
			href: "/projects",
			component: "a",
			icon: <AccountTreeIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: params.projectName,
			href: `/projects/actions/${params.projectId}`,
			component: "a",
			icon: <LabelImportantIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: params.commitHash,//t('bc.build', { ns: 'sidebar' }),
		}
	]),
	'/confirmemail': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.confirmemail', { ns: 'sidebar' }),
		}
	]),
	'/user_settings': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.usersettings', { ns: 'sidebar' }),
		}
	]),
	'/payments': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.payments', { ns: 'sidebar' }),
		}
	]),
	'/admin': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
		}
	]),
	
	'/admin/users': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.users', { ns: 'sidebar' }),
		}
	]),
	'/admin/users/[userId]': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.users', { ns: 'sidebar' }),
			href: "/admin/users",
			component: "a",
			icon: <PeopleOutlineIcon fontSize="small" />,
		},
		{
			label: `ID: ${params.userId}`,
		}
	]),
	
	'/admin/articles_panel': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.articles', { ns: 'sidebar' }),
		}
	]),
	'/admin/articles_panel/new': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.articles', { ns: 'sidebar' }),
			href: "/admin/articles_panel",
			component: "a",
			icon: <ArticleIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: t('bc.new_article', { ns: 'sidebar' }),
		}
	]),
	'/admin/articles_panel/edit/[articleId]': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.articles', { ns: 'sidebar' }),
			href: "/admin/articles_panel",
			component: "a",
			icon: <ArticleIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: t('bc.edit_article', { ns: 'sidebar' }),
		}
	]),
	'/admin/articles_panel/view/[articleId]': (params) => ([
		{
			label: t('bc.home', { ns: 'sidebar' }),
			href: "/",
			component: "a",
			icon: <HomeIcon fontSize="small" />,
		},
		{
			label: t('bc.admin', { ns: 'sidebar' }),
			href: "/admin",
			component: "a",
			icon: <ManageAccountsIcon fontSize="small" />,
		},
		{
			label: t('bc.articles', { ns: 'sidebar' }),
			href: "/admin/articles_panel",
			component: "a",
			icon: <ArticleIcon style={{ fontSize: '15px' }} fontSize="small" />,
		},
		{
			label: t('bc.view_article', { ns: 'sidebar' }),
		}
	]),
});

export default getBcList;
