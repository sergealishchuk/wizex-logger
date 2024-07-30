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
	white-space: nowrap;
	font-size: 15px;
	height: 21px;
	margin: 2px 4px;
	color: #204a96;
	box-shadow: none;
	border: 1px transparent solid;
	&[btn="green"] {
		color: white;
		border: 1px transparent solid;
		background-color: #0b660b;
		&:hover {
			background-color: #034903;
			box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
		}
	}
	&[btn="blue"] {
		color: white;
		border: 1px transparent solid;
		background-color: #204a96;
		&:hover {
			background-color: #143a7f;
			box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
		}
	}
	&[btn="red"] {
		color: white;
		border: 1px transparent solid;
		background-color: #5f0909;
		&:hover {
			background-color: #440000;
			box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
		}
	}
	&[disabled] {
		color: #9b9b9b;
		background-color: white !important;
		border: 1px #b5b5b5 solid;
		box-shadow: none;
	}
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
