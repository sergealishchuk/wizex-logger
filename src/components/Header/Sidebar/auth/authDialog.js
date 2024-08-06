import { _, getResponseMessage } from '~/utils';
import { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '~/components/formik/TextField';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '~/components/Dialog';
import { useSnackbar } from 'notistack';
import { userService } from '~/http/services';
import { ErrorMessages } from '../../components';
import {
	SmallButton,
	SmallLabel,
	FlexContainer,
} from '~/components/StyledComponents';
import PasswordField from '~/components/formik/PasswordField';
import store from '~/utils/store';
import { useTranslation } from 'next-i18next';


export default function AuthDialog(props) {
	const {
		children,
		onCloseAndOpenRegisterDialog,
		onCloseAndOpenResetPasswordDialog,
		onSuccessSignIn,
		...rest
	} = props;

	const [closeDialog, setCloseDialog] = useState(false);
	const [errors, setErrors] = useState([]);
	const [email, setEmail] = useState('');
	const [forgetAccount, setForgetAccount] = useState(false);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { t } = useTranslation(['sidebar']);
	const router = useRouter();

	const refFormik = useRef(null);

	const { openDialog: isOpen } = rest;

	const validationSchema = yup.object().shape({
		email: yup
			.string(t('auth.enter_your_email', { ns: 'sidebar' }))
			.email(t('auth.enter_valid_email', { ns: 'sidebar' }))
			.required(t('auth.email_is_required', { ns: 'sidebar' })),
		password: yup
			.string(t('auth.enter_password', { ns: 'sidebar' }))
			.required(t('auth.password_is_required', { ns: 'sidebar' })),
	});

	useEffect(() => {
		const lastRegisteredEmail = store.get('lastRegisteredEmail');
		if (lastRegisteredEmail) {
			setEmail(lastRegisteredEmail);
		}
		const emailFromLastRegistration = store.addListener('lastRegisteredEmail', value => setEmail(value));
		return () => {
			store.removeListener(emailFromLastRegistration);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			setErrors([]);
			setForgetAccount(false);
		} else {
			if (onSuccessSignIn) {
				onSuccessSignIn.cb = _.noop;
			}
		}
	}, [isOpen]);

	const handleClose = () => {
		setCloseDialog(true);
		setTimeout(() => setCloseDialog(false), 100);
	};

	const handleClearErrors = () => {
		if (errors.length > 0) {
			setErrors([]);
		}
	};

	const handleOpenRegisterDialog = () => {
		if (_.isFunction(onCloseAndOpenRegisterDialog)) {
			onCloseAndOpenRegisterDialog();
		}
	};

	const handleOpenResetPasswordDialog = () => {
		if (_.isFunction(onCloseAndOpenResetPasswordDialog)) {
			const { email } = refFormik.current.values;
			onCloseAndOpenResetPasswordDialog(email);
		}
	}

	const onSubmit = async (values, { setSubmitting }) => {
		const { email: emailInput } = values;
		const email = emailInput.trim();
		const result = await userService.login({
			...values,
			email,
		});
		store.set('lastRegisteredEmail', email);

		if (result && result.error) {
			const { error: { errors }, ERROR_CODE } = result;
			const message = getResponseMessage(result);
			if (message) {
				setErrors([{ message }]);
			}
			if (ERROR_CODE && ERROR_CODE.name === 'USER_WITH_EMAIL_NOT_EXISTS') {
				setForgetAccount(true);
			}
		} else {
			const { firstname } = result;
			enqueueSnackbar(`${t('auth.hello_str1', { ns: 'sidebar' })}${firstname}${t('auth.hello_str2', { ns: 'sidebar' })}`, { variant: 'success' });
			router.reload();
			setTimeout(() => {
				handleClose();
				closeSnackbar();
				if (_.isObject(onSuccessSignIn)) {
					const { cb } = onSuccessSignIn;
					if (cb && _.isFunction(cb)) {
						cb(router);
					}
				}
			}, 1000);
		}
	};

	const handleForgetAccount = () => {
		store.set('lastRegisteredEmail', '');
		store.set('userInfo', {});
		handleClose();
		router.push('/');
	};

	const actions = (
		<>
			<FlexContainer column ai="flex-start" mt2={2}>
				<FlexContainer row style={{ marginBottom: '16px' }}>
					<SmallLabel>{t('auth.no_account', { ns: 'sidebar' })}</SmallLabel>
					<SmallButton onClick={handleOpenRegisterDialog}>{t('auth.buttons.registration', { ns: 'sidebar' })}</SmallButton>
				</FlexContainer>
				<FlexContainer row>
					<SmallLabel>{t('auth.forgot_your_password', { ns: 'sidebar' })}</SmallLabel>
					<SmallButton onClick={handleOpenResetPasswordDialog} style={{ whiteSpace: 'nowrap' }}>{t('auth.buttons.reset_password', { ns: 'sidebar' })}</SmallButton>
				</FlexContainer>
			</FlexContainer>

			<DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
				<FlexContainer jc="space-between" style={{ width: '100%', flexWrap: 'wrap' }}>
					{
						forgetAccount
							? <Button onClick={handleForgetAccount}>
								{t('auth.buttons.forgetAccount', { ns: 'sidebar' })}
							</Button>
							: <span></span>
					}
					<div>
						<Button onClick={handleClose}>
							{t('auth.buttons.cancel', { ns: 'sidebar' })}
						</Button>
						<Button type="submit">
							{t('auth.buttons.sign_in', { ns: 'sidebar' })}
						</Button>
					</div>
				</FlexContainer>
			</DialogActions>
		</>
	);

	return (
		<Dialog
			title={t('auth.sign_in', { ns: 'sidebar' })}
			forceClose={closeDialog}
			{...rest}
			style={{ width: '400px', paddingBottom: 0 }}
		>
			<ErrorMessages errors={errors} />
			<Formik
				innerRef={refFormik}
				initialValues={{ email, password: '' }}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
				validateOnBlur={false}
			>
				{(props) => {
					return (
						<Form onChange={handleClearErrors}>
							<Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: 0 }}>
								<Grid item xs={12}>
									<Grid container spacing={{ xs: 4 }}>
										<Grid item xs={12}>
											<TextField
												name="email"
												label={t('auth.email', { ns: 'sidebar' })}
												type="text"
												inputProps={{ autoFocus: !Boolean(email) }}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
										<Grid item xs={12}>
											<PasswordField
												name="password"
												label={t('auth.password', { ns: 'sidebar' })}
												inputProps={{ autoFocus: Boolean(email) }}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12}>
									{actions}
								</Grid>
							</Grid>
						</Form>
					)
				}}
			</Formik>
		</Dialog>
	)
};
