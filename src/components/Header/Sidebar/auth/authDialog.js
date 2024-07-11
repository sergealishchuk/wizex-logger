import { _ } from '~/utils';
import { useState, useEffect } from 'react';
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
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { t } = useTranslation(['sidebar']);
	const router = useRouter();

	const { openDialog: isOpen } = rest;

	const validationSchema = yup.object().shape({
		email: yup
			.string(t('auth.enter_your_email', { ns: 'sidebar'}))
			.email(t('auth.enter_valid_email', { ns: 'sidebar'}))
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
			onCloseAndOpenResetPasswordDialog();
		}
	}

	const onSubmit = async (values, { setSubmitting }) => {
		const { email } = values;
		const result = await userService.login(values);
		store.set('lastRegisteredEmail', email);

		if (result && result.error) {
			const { error: { errors } } = result;
			setErrors(errors);
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

	const actions = (
		<>
			<FlexContainer jc="space-between" mt8={2}>
				<FlexContainer column>
					<SmallLabel>{t('auth.no_account', { ns: 'sidebar' })}</SmallLabel>
					<SmallButton onClick={handleOpenRegisterDialog}>{t('auth.buttons.registration', { ns: 'sidebar' })}</SmallButton>
				</FlexContainer>
				<FlexContainer column>
					<SmallLabel>{t('auth.forgot_your_password', { ns: 'sidebar' })}</SmallLabel>
					<SmallButton onClick={handleOpenResetPasswordDialog} style={{marginTop: '13px', whiteSpace: 'nowrap'}}>{t('auth.buttons.reset_password', { ns: 'sidebar' })}</SmallButton>
				</FlexContainer>
			</FlexContainer>

			<DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
				<Button onClick={handleClose}>
				{t('auth.buttons.cancel', { ns: 'sidebar' })}
				</Button>
				<Button type="submit">
				{t('auth.buttons.sign_in', { ns: 'sidebar' })}
				</Button>
			</DialogActions>
		</>
	);

	return (
		<Dialog
			title={t('auth.sign_in', { ns: 'sidebar'})}
			forceClose={closeDialog}
			{...rest}
			style={{ width: '400px' }}
		>
			<ErrorMessages errors={errors} />
			<Formik
				initialValues={{ email, password: '11111q' }}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
				validateOnBlur={false}
			>
				{(props) => {
					return (
						<Form onChange={handleClearErrors}>
							<Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: '0 20px' }}>
								<Grid item xs={12}>
									<Grid container spacing={{ xs: 4 }}>
										<Grid item xs={12}>
											<TextField
												name="email"
												label={t('auth.email', { ns: 'sidebar' })}
												type="text"
												inputProps={{ autoFocus: !Boolean(email) }}
											/>
										</Grid>
										<Grid item xs={12}>
											<PasswordField
                        name="password"
                        label={t('auth.password', { ns: 'sidebar' })}
												inputProps={{ autoFocus: Boolean(email) }}
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
