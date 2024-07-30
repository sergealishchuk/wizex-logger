import { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '~/components/formik/TextField';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import styledEmo from '@emotion/styled';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Dialog from '~/components/Dialog';
import { userService } from '~/http/services';
import {
	SmallButton,
	SmallLabel,
	FlexContainer,
} from '~/components/StyledComponents';
import { ErrorMessages } from '../../components';
import { useSnackbar } from 'notistack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PasswordField from '~/components/formik/PasswordField';
import store from '~/utils/store';
import { useTranslation } from 'next-i18next';
import { _ } from '~/utils'

const InputCodeStyled = styledEmo.div`
	display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  margin-left: -48px;
`;

const BackButtonStyled = styledEmo(Button)`
	.MuiButton-startIcon {
		margin-right: 0;
	}
`;

export default function ResetPasswordDialog(props) {
	const { children, onCloseAndOpenAuthDialog, ...rest } = props;
	const [closeDialog, setCloseDialog] = useState(false);
	const [errors, setErrors] = useState([]);
	const [email, setEmail] = useState('');
	const { enqueueSnackbar } = useSnackbar();
	const [codeSent, setCodeSent] = useState(false);
	const [codeField, setCodeField] = useState();
	const [inputNewPasswordForm, setInputNewPasswordForm] = useState(false);
	const { t } = useTranslation(['sidebar']);

	const { openDialog: isOpen } = rest;

	const refFormik = useRef(null);

	const validationSchema = yup.object({
		email: yup
			.string(t('auth.enter_your_email', { ns: 'sidebar' }))
			.email(t('auth.enter_valid_email', { ns: 'sidebar' }))
			.required(t('auth.email_is_required', { ns: 'sidebar' })),
		code: yup
			.string()
			.required()
			.matches(/^[0-9]+$/, t('auth.must_only_digits', { ns: 'sidebar' }))
			.min(6, t('auth.must_exactly', { ns: 'sidebar' }))
			.max(6, t('auth.must_exactly', { ns: 'sidebar' })),
		password: yup
			.string(t('auth.enter_password', { ns: 'sidebar' }))
	});

	useEffect(() => {
		const emailFromLastRegistration =
			store.addListener('lastRegisteredEmail', value => setEmail(value));

		return () => {
			store.removeListener(emailFromLastRegistration);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			const lastRegisteredEmail = store.get('lastRegisteredEmail');
			if (lastRegisteredEmail) {
				setEmail(lastRegisteredEmail);
			}
			setErrors([]);
			setCodeSent(false);
			setInputNewPasswordForm(false);
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

	const handleOpenAuthDialog = () => {
		if (_.isFunction(onCloseAndOpenAuthDialog)) {
			onCloseAndOpenAuthDialog();
		}
	};

	const handleSendMeCode = async () => {
		const { setFieldValue, setTouched } = refFormik.current;
		const { email } = refFormik.current.values;

		handleClearErrors();
		setTouched({}, false);
		setFieldValue('code', '');
		setInputNewPasswordForm(false);

		const result = await userService.forgotpassword({ email });

		if (result && result.error) {
			const { error: { errors } } = result;
			setErrors(errors);
		} else {
			setCodeSent(true);
			enqueueSnackbar(t('auth.code_has_been_send', { ns: 'sidebar' }), { variant: 'info' });
		}
	};

	const handleConfirmCode = async () => {
		const { isValid, values, setFieldValue, errors } = refFormik.current;
		const { email, code } = values;

		if (!isValid) {
			return
		}

		const result = await userService.confirmrecovercode({ email, code });

		if (result && result.error) {
			const { error: { errors } } = result;
			setErrors(errors);
		} else {
			if (result.ok) {
				setInputNewPasswordForm(true);
				setFieldValue('password', '');
			}
		}
	};

	const handleBack = () => {
		setCodeSent(false);
		handleClearErrors();
	};

	const handleSaveNewPassword = async () => {
		const { isValid, values } = refFormik.current;
		const { email, code, password } = values;

		if (!isValid) {
			return
		}

		const result = await userService.recoverpasswordbycode({ email, code, password });


		if (result && result.error) {
			const { error: { errors } } = result;
			setErrors(errors);
		} else {
			if (result.ok) {
				store.set('lastRegisteredEmail', email);
				enqueueSnackbar(t('auth.password_saved', { ns: 'sidebar' }), { variant: 'info' });
				handleClose();
				handleOpenAuthDialog();
			}
		}
	};

	const actions = inputNewPasswordForm
		? (<div>
			<SmallButton onClick={() => handleSendMeCode()}>{t('auth.buttons.resend_code_to_email', { ns: 'sidebar' })}</SmallButton>
			<DialogActions sx={{ display: codeSent ? 'flex' : 'none', borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '4px' }}>
				<Button style={{ marginLeft: 'auto' }} onClick={handleClose}>
				{t('auth.buttons.cancel', { ns: 'sidebar' })}
				</Button>
				<Button type="submit" onClick={handleSaveNewPassword}>
				{t('auth.buttons.save', { ns: 'sidebar' })}
				</Button>
			</DialogActions>
		</div>)
		: (
			<>
				{!codeSent && (
					<FlexContainer row jc="space-between" style={{ borderTop: codeSent ? 'none' : '1px #e2e2e2 solid' }}>
						<FlexContainer column mt8={2}>
							<SmallLabel>{t('auth.i_remember_password', { ns: 'sidebar' })}</SmallLabel>
							<SmallButton onClick={handleOpenAuthDialog}>{t('auth.buttons.sign_in', { ns: 'sidebar' })}</SmallButton>
						</FlexContainer>
						<FlexContainer column mt8={2}>
							<SmallLabel>{t('auth.buttons.reset_password', { ns: 'sidebar' })}</SmallLabel>
							<SmallButton onClick={() => handleSendMeCode()}>{t('auth.buttons.send_code_to_email', { ns: 'sidebar' })}</SmallButton>
						</FlexContainer>
					</FlexContainer>
				)}

				<Collapse in={codeSent} timeout={500} style={{ width: '100%', paddingLeft: '48px' }}>
					<InputCodeStyled>
						<div style={{ fontWeight: '500' }}>
							<span>{t('auth.input_code', { ns: 'sidebar' })}</span><span> ({t('auth.six_digits', { ns: 'sidebar' })})</span>
						</div>
						<div>
							<TextField
								inputRef={(input) => { setCodeField(input) }}
								className="input-centered"
								name="code"
								label=""
								type="text"
								style={{ width: '220px', textAlign: 'center' }}
							/>
						</div>
					</InputCodeStyled>
				</Collapse>
				<DialogActions sx={{ display: codeSent ? 'flex' : 'none', borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
					<BackButtonStyled startIcon={<ArrowBackIosIcon />} onClick={handleBack}>
					{t('auth.buttons.back', { ns: 'sidebar' })}
					</BackButtonStyled>
					<Button style={{ marginLeft: 'auto' }} onClick={handleClose}>
					{t('auth.buttons.cancel', { ns: 'sidebar' })}
					</Button>
					<Button onClick={handleConfirmCode}>
					{t('auth.buttons.confirm', { ns: 'sidebar' })}
					</Button>
				</DialogActions>
			</>
		);

	return (
		<Dialog
			title={t('auth.reset_your_password', { ns: 'sidebar' })}
			forceClose={closeDialog}
			{...rest}
			style={{ width: '400px' }}
		>
			<ErrorMessages errors={errors} />
			<Formik
				innerRef={refFormik}
				initialValues={{ email }}
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
												disabled={codeSent}
											/>
										</Grid>
										{inputNewPasswordForm
											&& (
												<Grid item xs={12}>
													<PasswordField
														name="password"
														label={t('auth.new_password', { ns: 'sidebar' })}
														inputProps={{ autoFocus: Boolean(email) }}
													/>
												</Grid>
											)
										}
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
