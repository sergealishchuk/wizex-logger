
import { styled } from '@mui/material/styles';

const BGImageStyled = styled('div')((props) => ({
	height: '400px',
	width: 'auto',
	position: 'relative',
  marginLeft: 'auto',
	marginRight: 'auto',
	backgroundSize: 'contain',
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundImage: `url(${props.src})`,
	overflow: 'hidden'
}));

export default function BGImage(props) {
	const { src, ...rest } = props;
	return (
		<BGImageStyled src={src} {...rest} />
	)
};
