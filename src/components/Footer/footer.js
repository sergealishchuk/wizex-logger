import styled from '@emotion/styled'

const FooterStyled = styled.div`
	background-color: #f6f6f605;
	color: #a4a4a4;
	font-size: 16px;
	text-align: center;
	padding: 20px;
	border-top: 2px #ebebeb solid;
	margin-top: auto;
`;

export default function Footer(props) {
	
	return (
		<>
			<FooterStyled>&copy; Copyright 2024 wizex.pro</FooterStyled>
		</>
	)
};
