import { useState } from 'react';
import { styled } from '@mui/material/styles';
import styledEmo from '@emotion/styled';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextField from '~/components/formik/TextField';

const Container = styledEmo.div`
  display: flex;
  alignItems: center;
  justifyContent: center;
`;

const VisiblePassword = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  marginLeft: '24px',
  height: '39px'
}));

const WrapTextField = (props) => {
  const [visiblePassword, setVisiblePassword] = useState(true);

  const handleChangeStyle = () => {
    setVisiblePassword(!visiblePassword);
  }

  return (
    <>
      <Container>
        <TextField
          className={visiblePassword ? 'password-as-text' : ''}
          type="text"
          {...props}
        />
        <VisiblePassword onClick={handleChangeStyle}>
          {
            visiblePassword
              ? <VisibilityIcon />
              : <VisibilityOffIcon />
          }
        </VisiblePassword>
      </Container>
    </>
  )
};

export default WrapTextField;
