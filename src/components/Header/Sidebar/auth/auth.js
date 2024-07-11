import { _ } from '~/utils';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from "~/components/Link";
import User from '~/components/User';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const AuthStyled = styled.div`
	background-color: #580518;
	color: #fff;
	font-size: 16px;
	text-align: center;
	padding: 5px 20px;
	font-family: monospace;
`;

export default function Auth(props) {
	const { openAuthDialog, openRegisterDialog, onClose } = props;
	const [user, setUser] = useState(User.isLog() && User.read());
	const router = useRouter();
	const { t } = useTranslation('sidebar');

	useEffect(() => {
		const userInfo = User.isLog() && User.read();
		if (userInfo) {
			const { name, email } = userInfo;
			setUser({
				name,
				email,
			});
		} else {
			setUser(false);
		}
	}, []);

	const handleOpenProfile = (event) => {
		event.preventDefault();
		if (user) {
			router.push('/profile');
			if (_.isFunction(onClose)) {
				onClose();
			}
		}
	}

	return (
		<AuthStyled>
			{user &&
				<div style={{ display: 'flex', alignItems: 'center', columnGap: '10px', padding: '10px' }}>
					<div><AccountCircleIcon style={{ fontSize: '30px' }} /></div>
					<div className="auth-registration-block" style={{ cursor: 'pointer' }}>
						<div>
							{user.name}
						</div>
						<div style={{ fontSize: '12px' }}>{user.email}</div>
					</div >
				</div>
			}
		</AuthStyled >
	)
};
