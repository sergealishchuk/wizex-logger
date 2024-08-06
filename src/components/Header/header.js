'use client';

import { pushTrigger } from "~/utils/shed";
import { useState, useEffect } from "react";
import { _ } from '~/utils';
import cn from 'classnames';
import AppBar from "@mui/material/AppBar";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'next-i18next';
import Link from "../Link";
import Sidebar from "./Sidebar";
//import AuthDialog from "./Sidebar/auth/authDialog";
import { AuthDialog } from "@lib/wizen";
import RegisterDialog from '@lib/wizen/es/RegisterDialog'
//import RegisterDialog from "./Sidebar/auth/registerDialog";
//import ResetPasswordDialog from "./Sidebar/auth/resetPasswordDialog";
import ResetPasswordDialog from "@lib/wizen/es/ResetPasswordDialog";
import OfferAuthDialog from "./Sidebar/auth/offerAuthDialog";
import AlertLogOutConfirmDialog from './Sidebar/auth/logoutAlert';
import AboutDialog from "./Sidebar/auth/aboutDialog";
import { store } from '~/utils';
import Observer from "~/utils/observer";
import User, { UserStorePath } from "../User";
import { useRouter } from 'next/router';
import SocketServer from "~/socket";
import Search from './components/search';
import KeyManager from "../KeyManager";
import useMediaQuery from '@mui/material/useMediaQuery';

const focusChange = _.debounce((state, cb = _.noop) => {
	if (!document.hidden) {
		cb(state);
	}
}, 100);

if (typeof (window) !== 'undefined') {
	window.Observer = Observer;
	window.User = User;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
	marginRight: '16px',
	'& .MuiBadge-badge': {
		right: -13,
		top: 4,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0 4px',
		transform: 'none',
		transition: 'none',
		height: '20px',
		minWidth: '26px',
		backgroundColor: '#55a348'
	},
	'&.noproducts': {
		".MuiBadge-badge": {
			display: 'none'
		}
	}
}));

const IconButtonStyled = styled(IconButton)(() => ({
	marginRight: '2px'
}));

export default () => {
	const router = useRouter();
	const { locale, locales } = router;

	const [menuOpen, setMenuOpen] = useState(false);
	const [openAuthDialog, setOpenAuthDialog] = useState(false);
	const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
	const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
	const [openOfferAuthDialog, setOpenOfferAuthDialog] = useState(false);
	const [numberOfproducts, setNumberOfproducts] = useState(0);
	const [userLogginded, setUserLoggined] = useState(true);
	const [successSignInHandler, setSuccessSignInHandler] = useState();
	const [offerAuthParams, setOfferAuthParams] = useState();
	const [openConfirmLogOutAlert, setOpenConfirmLogOutAlert] = useState(false);
	const [openAboutDialog, setOpenAboutDialog] = useState(false);
	const [windowFocus, setWindowFocus] = useState(true);
	const [showSearchIcon, setShowSearchIcon] = useState(false);
	const [resetEmail, setResetEmail] = useState();

	const { t } = useTranslation(['sidebar']);

	const Mobile = !useMediaQuery('(min-width:600px)');

	const isAdminSection = /^\/admin/.test(router.route);

	useEffect(() => {
		const productCounterHandlerRef = store.addListener(
			'cart.numberOfProducts',
			(value) => {
				setNumberOfproducts(value);
			}
		);

		const userInfoHandlerRef = store.addListener(
			'userInfo',
			(userInfo) => {

				if (_.isEmpty(userInfo)) {
					setUserLoggined(false);
				}
			}
		);

		setUserLoggined(User.isLog());

		SocketServer.connect();

		const userInformation = store.addListener(
			UserStorePath,
			(value) => {
				setUserLoggined(Boolean(value && value.email));
			}
		);

		const OpenSignInDialog = Observer.addListener('OpenSignInDialog', (params = {}, cb) => {
			const { action } = params;
			setSuccessSignInHandler({ cb });
			if (action && action === 'registration') {
				setOpenRegisterDialog(true);
			} else {
				setOpenAuthDialog(true);
			}
		});

		const OpenOfferAuthDialog = Observer.addListener('OpenOfferAuthDialog', (params, cb) => {
			setOfferAuthParams({ params, cb });
			setOpenOfferAuthDialog(true);
		});

		const OpenLogoutConfirmAlert = Observer.addListener('OpenLogoutConfirmAlert', (params, cb) => {
			setOpenConfirmLogOutAlert(true);
		});

		const OpenAboutDialog = Observer.addListener('OpenAboutDialog', () => {
			setOpenAboutDialog(true);
		});

		const WindowFocusHandler = (value) => {
			focusChange(true, (active) => {
				setWindowFocus(active);
				Observer.send('onWindowFocus', true);
			});
		};
		window.addEventListener('focus', WindowFocusHandler);

		const WindowBlurHandler = (value) => {
			focusChange(false, (active) => {
				setWindowFocus(active);
				Observer.send('onWindowFocus', false);
			});
		};
		window.addEventListener('blur', WindowBlurHandler);

		return () => {
			store.removeListener(productCounterHandlerRef);
			store.removeListener(userInformation);
			store.removeListener(userInfoHandlerRef);
			Observer.removeListener(OpenSignInDialog);
			Observer.removeListener(OpenOfferAuthDialog);
			Observer.removeListener(OpenLogoutConfirmAlert);
			Observer.removeListener(OpenAboutDialog);
			window.removeEventListener('focus', WindowFocusHandler);
			window.removeEventListener('blur', WindowBlurHandler);
		};
	}, []);

	useEffect(() => {
		//setShowSearchIcon(!router.asPath.startsWith('/shop/') && router.pathname !== "/");
	}, [router])

	const handleSideMenu = () => {
		setMenuOpen(true);
	}

	const handleOpenAuthDialog = () => {
		setTimeout(() => setMenuOpen(false), 300);
		setOpenAuthDialog(true);
	};

	const handleOpenRegisterDialog = () => {
		setTimeout(() => setMenuOpen(false), 300);
		setOpenRegisterDialog(true);
	};

	const handleCloseResetPasswordDialog = () => {
		setOpenResetPasswordDialog(false);
	}

	const handleCloseAuthDialog = () => {
		setOpenAuthDialog(false);
	};

	const handleCloseAndOpenRegisterDialog = () => {
		setOpenAuthDialog(false);
		handleOpenRegisterDialog();
	};

	const handleCloseAndOpenResetPasswordDialog = (email) => {
		setResetEmail(email);
		setOpenAuthDialog(false);
		setOpenResetPasswordDialog(true)
	}

	const handleCloseAndOpenAuthDialog = () => {
		setOpenResetPasswordDialog(false);
		setOpenRegisterDialog(false);
		handleOpenAuthDialog();
	};

	const handleCloseRegisterDialog = () => {
		setOpenRegisterDialog(false);
	};

	const handleCloseOfferAuthDialog = () => {
		setOpenOfferAuthDialog(false);
	};

	const handleChangeLocale = (l) => {
		if (l !== locale) {
			router.push(
				{
					pathname: router.pathname,
					query: router.query
				},
				router.asPath,
				{ locale: l }
			);
		}
	};

	const handleSearch = () => {
		if (router.asPath.startsWith('/shop/') || router.pathname === "/") {
			Observer.send('onGoToTheSearchLine');
		} else {
			pushTrigger('triggerOpenSearchDialog');
		}
	};

	return /*User && User.isLog()*/true ? (
		<>
			<Sidebar
				onOpen={menuOpen}
				onClose={() => setTimeout(() => setMenuOpen(false), 100)}
				openAuthDialog={handleOpenAuthDialog}
				openRegisterDialog={handleOpenRegisterDialog}
			/>
			<AuthDialog
				openDialog={openAuthDialog}
				onClose={handleCloseAuthDialog}
				onCloseAndOpenRegisterDialog={handleCloseAndOpenRegisterDialog}
				onCloseAndOpenResetPasswordDialog={handleCloseAndOpenResetPasswordDialog}
				onSuccessSignIn={successSignInHandler}
			/>
			<RegisterDialog
				openDialog={openRegisterDialog}
				withParams={offerAuthParams}
				onClose={handleCloseRegisterDialog}
				onCloseAndOpenAuthDialog={handleCloseAndOpenAuthDialog}
			/>
			<ResetPasswordDialog
				resetEmail={resetEmail}
				openDialog={openResetPasswordDialog}
				onClose={handleCloseResetPasswordDialog}
				onCloseAndOpenAuthDialog={handleCloseAndOpenAuthDialog}
			/>
			<OfferAuthDialog
				openDialog={openOfferAuthDialog}
				onClose={handleCloseOfferAuthDialog}
				offerAuthParams={offerAuthParams}
			/>
			<AlertLogOutConfirmDialog
				openConfirmLogOutAlert={openConfirmLogOutAlert}
				setOpenConfirmLogOutAlert={setOpenConfirmLogOutAlert}
			/>
			<AboutDialog
				openAboutDialog={openAboutDialog}
				setOpenAboutDialog={setOpenAboutDialog}
			/>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="fixed" style={{
					backgroundColor: windowFocus ? '#580518' : 'gray',
					transition: 'background-color 300ms',
					zIndex: 9999999,
				}}>


					<Toolbar className="toolbar-header-root">
						{userLogginded
							? <Tooltip title={t('open_menu', { ns: 'sidebar' })}>
								<span>
									<IconButton
										size="large"
										edge="start"
										color="inherit"
										aria-label="menu"
										onClick={handleSideMenu}
									>
										<MenuIcon />
									</IconButton>
								</span>
							</Tooltip>
							: null
						}
						<div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
							<Link href="/">
								<span style={{ fontSize: Mobile && !userLogginded ? '24px' : '32px', fontWeight: 'bold', marginRight: '12px', lineHeight: Mobile && !userLogginded ? '25px' : '32px' }}>WIZEX</span>
							</Link>
							<div style={{ whiteSpace: 'nowrap', fontSize: Mobile && !userLogginded ? '16px' : '26px', color: '#e1efff', fontStyle: 'italic', margin: '0' }}>CodeMonitor</div>
						</div>
						{userLogginded}
						{!userLogginded && (
							<div style={{ paddingRight: isAdminSection ? 0 : '7px' }}>
								{
									_.map(locales, (localeItem, index) => (

										<Tooltip title={
											t(localeItem === 'uk'
												? (
													locale === localeItem ? '' : 'switch_to_ukrainian'
												)
												: (
													locale === localeItem ? '' : 'switch_to_english'
												), { ns: 'sidebar' })
										}>
											<span
												key={index}
												onClick={() => handleChangeLocale(localeItem)}
												className="unselect"
												style={{
													marginRight: '6px',
													padding: '2px 6px',
													cursor: locale === localeItem ? 'default' : 'pointer',
													backgroundColor: `${locale === localeItem ? 'gray' : 'transparent'}`
												}}>
												{localeItem}
											</span>
										</Tooltip>
									))
								}
							</div>
						)}

						{!userLogginded && (

							<Tooltip title={t('auth.buttons.sign_in', { ns: 'sidebar' })}>
								<span>
									<IconButtonStyled onClick={() => setOpenAuthDialog(true)}>
										<PersonOutlineIcon style={{ color: '#b8b8b8' }} />
									</IconButtonStyled>
								</span>
							</Tooltip>
						)}


						{showSearchIcon && (
							<Tooltip title={t('search', { ns: 'sidebar' })}>
								<IconButton onClick={handleSearch} aria-label="search" style={{ marginLeft: '26px', color: '#ddd', height: '16px', width: '16px' }}>
									<SearchIcon />
								</IconButton>
							</Tooltip>
						)}
					</Toolbar>
				</AppBar>
			</Box>
			<Search />
			<KeyManager />
		</>
	) : null
};
