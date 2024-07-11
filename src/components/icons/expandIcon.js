
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default (props) => {
  const {collapse, style = {}} = props;

  return (
    <ExpandMoreIcon style={{
      float: 'right',
      transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      transform: `rotate(${collapse ? '-180' : '0'}deg)`,
      backgroundColor: '#dadada',
      borderRadius: '16px',
      ...style,
    }} />
  )
};
