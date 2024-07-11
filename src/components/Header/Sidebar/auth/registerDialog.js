import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '~/components/formik/TextField';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '~/components/Dialog';
import { ErrorMessages } from '../../components';
import { userService } from '~/http/services';
import { useSnackbar } from 'notistack';
import PasswordField from '~/components/formik/PasswordField';
import SubmitController from '~/components/formik/SubmitController';
import store from '~/utils/store';
import {
	FlexContainer,
	SmallButton,
	SmallLabel
} from '~/components/StyledComponents';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { _ } from '~/utils';

export default function RegisterDialog(props) {
	const { children, onCloseAndOpenAuthDialog, withParams = {}, ...rest } = props;
	const [closeDialog, setCloseDialog] = useState(false);
	const [errors, setErrors] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [formChanged, setFormChanged] = useState(false);
	const { t } = useTranslation(['sidebar']);
	const router = useRouter();
	const [initialValues, setInitialValues] = useState({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
	});
	const { openDialog: isOpen } = rest;

	const validationSchema = yup.object().shape({
		firstname: yup
			.string(t('auth.enter_your_name', { ns: 'sidebar' }))
			.required(t('auth.name_is_required', { ns: 'sidebar' })),
		lastname: yup
			.string(t('auth.enter_your_surname', { ns: 'sidebar' }))
			.required(t('auth.surname_is_required', { ns: 'sidebar' })),
		email: yup
			.string(t('auth.enter_your_email', { ns: 'sidebar' }))
			.email(t('auth.enter_valid_email', { ns: 'sidebar' }))
			.required(t('auth.email_is_required', { ns: 'sidebar' })),
		password: yup
			.string(t('auth.enter_password', { ns: 'sidebar' }))
			.min(6, t('auth.enter_valid_password', { ns: 'sidebar' }))
			.required(t('auth.password_is_required', { ns: 'sidebar' })),
	});

	useEffect(() => {
		if (isOpen) {
			setErrors([]);
			const { params } = withParams;
			if (params) {
				setInitialValues({
					...initialValues,
					...params,
				});
			}
		}
	}, [isOpen]);

	const handleClearErrors = () => {
		if (errors.length > 0) {
			setErrors([]);
		}
	};

	const handleClose = () => {
		setCloseDialog(true);
		setTimeout(() => setCloseDialog(false), 100);
	};

	const handleOpenAuthDialog = () => {
		if (_.isFunction(onCloseAndOpenAuthDialog)) {
			onCloseAndOpenAuthDialog();
		}
	};

	const onSubmit = async (values, { setSubmitting }) => {
		const { email } = values;
		const result = await userService.signUp({
			...values,
			contactemail: email,
			locale: router.locale,
		});

		if (result && result.error) {
			const { error: { errors } } = result;
			setSubmitting(false);
			setErrors(errors);
		} else {
			enqueueSnackbar(t('auth.success_registered', { ns: 'sidebar' }), { variant: 'success' });
			store.set('lastRegisteredEmail', email);
			handleOpenAuthDialog();
		}
	};

	const handleFormChanged = (value) => {
		setFormChanged(value);
	};

	const actions = (
		<>
			<div>
				<FlexContainer mt8={2} jc="left">
					<SmallLabel>{t('auth.i_have_account', { ns: 'sidebar' })}</SmallLabel>
					<SmallButton onClick={handleOpenAuthDialog}>{t('auth.buttons.sign_in', { ns: 'sidebar' })}</SmallButton>
				</FlexContainer>
			</div>
			<DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
				<Button onClick={handleClose}>
					{t('auth.buttons.cancel', { ns: 'sidebar' })}
				</Button>
				<Button type="submit">
					{t('auth.buttons.continue', { ns: 'sidebar' })}
				</Button>
			</DialogActions>
		</>
	);

	return (
		<Dialog
			title={t('auth.registration', { ns: 'sidebar' })}
			forceClose={closeDialog}
			{...rest}
			style={{ width: '400px' }}
		>
			<ErrorMessages errors={errors} />
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
				validateOnBlur={false}
				enableReinitialize
			>
				{(props) => {
					return (
						<Form onChange={handleClearErrors}>
							<Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: '0 20px' }}>
								<Grid item xs={12}>
									<Grid container spacing={{ xs: 2 }}>
										<Grid item xs={12}>
											<TextField
												name="firstname"
												label={t('auth.your_name', { ns: 'sidebar' })}
												type="text"
												inputProps={{ autoFocus: true }}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												name="lastname"
												label={t('auth.your_surname', { ns: 'sidebar' })}
												type="text"
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												name="email"
												label={t('auth.email', { ns: 'sidebar' })}
												type="text"
											/>
										</Grid>
										<Grid item xs={12}>
											<PasswordField
												name="password"
												label={t('auth.password', { ns: 'sidebar' })}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12}>
									{actions}
								</Grid>
							</Grid>
							<SubmitController name="RegisterDialog" onFormChanged={handleFormChanged} />
						</Form>
					)
				}}
			</Formik>
		</Dialog>
	)
};
