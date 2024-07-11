import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const IconViewStyled = styled(VisibilityIcon)`
  margin-left: 8px;
  width: 26px;
  height: 26px;
  border: 1px gray solid;
  border-radius: 12px;
  color: gray;
`;

export const SmallButton = styled(Button)`
	text-transform: capitalize;
	font-size: 14px;
	height: 21px;
`;

export const SmallLabel = styled('span')`
	font-size: 10px;
`;

export const FlexContainer = styled('div')(props => ({
	display: 'flex',
	flexDirection: (props.column && 'column') || (props.row && 'row'),
	alignItems: props.ai || 'center',
	justifyContent: props.jc || 'center',
	marginTop: props.mt8 && `${Number(props.mt8) * 8}px`,
}));

export const StyledErrorPage = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	div.status {
		border-right: 1px #c5c5c5 solid;
		padding: 13px;
    margin: 19px;
    font-size: 26px;
    border-right: 1px gray solid;
	}
	div.errorlist {
		font-size: 13px;
		display: flex;
		flex-direction: column;
		.code {
			font-size: 10px;
			color: brown;
		}
	}
`;

export const ButtonSectionStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px #eee solid;
	padding-bottom: 10px;
`;
