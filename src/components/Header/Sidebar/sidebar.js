import { connect, dispatch } from '~/utils/shed';

import { _ } from '~/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListIcon from '@mui/icons-material/List';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Observer from '~/utils/observer';
import User from '~/components/User';
import { goodsService } from '~/http/services';
import RoundBadge from '~/components/RoundBadge';
import { store as localStore } from '~/utils';

import Divider from '@mui/material/Divider';
import Link from "../../Link";
import Auth from "./auth";
import { useTranslation } from 'next-i18next';
import { ROLES } from 'backend/constants';

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
	borderBottom: '1px #7e6a3e solid'
}));

const Sidebar = (props) => {

	const { onOpen, onClose, openAuthDialog, openRegisterDialog, store } = props;
	const { buyerUpdateStatus, sellerUpdateStatus } = store;

	const [routePath, setRoutePath] = useState('');
	const [updateWishBadge, setUpdateWishBadge] = useState('');
	const [numberOfProductsOnCart, setNumberOfProductsOnCart] = useState();
	const [currentBuyerUpdateStatus, setCurrentBuyerUpdateStatus] = useState(0);
	const [currentSellerUpdateStatus, setCurrentSellerUpdateStatus] = useState(0);
	const [userRoles, setUserRoles] = useState([]);

	const router = useRouter();
	const { t: translate } = useTranslation('sidebar');

	const menu = [
		{
			title: translate('home', { ns: 'sidebar' }),
			path: '/',
			icon: <HomeIcon />,
		},
		{
			divider: true,
		},
		{
			title: translate('all_projects', { ns: 'sidebar' }),
			path: '/projects',
			icon: <AccountTreeIcon />,
		},
		{
			divider: true,
		},
		
		{
			divider: true,
			marginTop: true,
		},
		{
			title: translate('shop_admin', { ns: 'sidebar' }),
			path: '/admin',
			icon: <SettingsIcon />,
			badge: <RoundBadge value={currentSellerUpdateStatus} color="#a34848" />,
			roles: [ROLES.SELLER],
		},
		{
			divider: true,
			roles: [ROLES.SELLER],
		},
		{
			title: translate('my_account', { ns: 'sidebar' }),
			path: '/profile',
			icon: <ManageAccountsIcon />,
			roles: [ROLES.USER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPERADMIN],
		},
		{
			divider: true,
			roles: [ROLES.USER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPERADMIN],
		},
		{
			title: translate('log_out', { ns: 'sidebar' }),
			onClick: () => {
				Observer.send('OpenLogoutConfirmAlert');
			},
			icon: <LogoutIcon />,
			roles: [ROLES.USER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPERADMIN],
		},
		{
			divider: true,
			//marginTop: !User.isLog(),
			roles: [ROLES.USER, ROLES.SELLER, ROLES.ADMIN, ROLES.SUPERADMIN],
		},
		{
			title: translate('about', { ns: 'sidebar' }),
			onClick: () => {
				Observer.send('OpenAboutDialog');
			},
			icon: <InfoIcon />,
			roles: [ROLES.ADMIN],
		},
	];

	useEffect(() => {
		setCurrentBuyerUpdateStatus(buyerUpdateStatus);
	}, [buyerUpdateStatus]);

	useEffect(() => {
		setCurrentSellerUpdateStatus(sellerUpdateStatus);
	}, [sellerUpdateStatus]);

	useEffect(() => {
		if (onOpen && User.isLog()) {
			const { roles } = User.read();
			setUserRoles(roles);
		}
		if (onOpen) {
			setNumberOfProductsOnCart(localStore.get('cart.numberOfProducts'));
		}
	}, [onOpen]);

	useEffect(() => {
		setRoutePath(router.route);
	}, [router]);

	const userIsLog = User.isLog();

	return (
		<Drawer PaperProps={{
			sx: {
				width: 320,
				color: "#fff",
				paddingBottom: '8px'
			}
		}} open={onOpen} onClose={onClose}>
			<div style={{ backgroundColor: '#580518' }}>
				<DrawerHeader>
					<span className="alioks-logo" style={{color: '#d2ecff', fontSize: '25px'}}>logger.wizex.pro</span>
					<Tooltip title={translate('close_menu', { ns: 'sidebar' })}>
						<span>
							<IconButton onClick={onClose} style={{ color: 'azure' }}>
								<ChevronLeftIcon />
							</IconButton>
						</span>
					</Tooltip>
				</DrawerHeader>
				<Auth
					openAuthDialog={openAuthDialog}
					onClose={onClose}
				/>
			</div>
			<Divider />
			{
				_.map(menu, (item, index) => {
					const itemRoles = item.roles ? item.roles : [];
					const accessPassed = (
						(itemRoles.length === 0) ||
					  (userRoles.filter(role => itemRoles.includes(role)).length > 0)
					);

					return accessPassed && (Boolean(item.divider === true)
						? (<Divider key={index} style={{ marginTop: item.marginTop ? 'auto' : 0 }} />)
						: item.sideBarBlock ? <div>{item.sideBarBlock}</div> : (
							<Link
								key={item.title}
								href={item.path}
								className="sidebar-item"
								disabled={_.isFunction(item.onClick)}
								onClick={() => {
									onClose();
									if (_.isFunction(item.onClick)) {
										item.onClick();
									}
								}}
								style={{
									backgroundColor: routePath === item.path ? '#ebebeb' : '#fff',
									marginTop: item.marginTop ? 'auto' : 0
								}}
							>
								<ListItem className="sidebar-item" disablePadding style={{ marginBottom: '6px' }}>
									<ListItemButton>
										<ListItemIcon className="sidebar-list-item-icon">
											{item.icon}
										</ListItemIcon>
										<ListItemText primary={item.title} />
										{item.badge}
									</ListItemButton>
								</ListItem>
							</Link>
						)
					)
				})
			}
		</Drawer >
	)
};

export default connect(['buyerUpdateStatus', 'sellerUpdateStatus'])(Sidebar);
