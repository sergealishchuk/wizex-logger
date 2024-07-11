import styled from "@emotion/styled";
import { Grid } from '@mui/material';
import TextField from '~/components/formik/TextField';

export const GridRowStyled = styled(Grid)`
  cursor: default;
  display: flex;
  align-items: center;
  min-height: 32px;
  font-size: 10px;
  border-bottom: 1px #cfcfcf solid;
  padding: 6px 3px;
  :hover {
    background-color: #f1f1f1;
  }
  .icon {
    font-size: 12px;
    :hover {
      cursor: pointer;
    }
  }
`;

export const GridUserStyled = styled(Grid)`
  font-size: 14px;
  padding: 8px 16px;
  color: #444;
  background-color: #f5f5f5;
  border-radius: 9px;
  cursor: default;
  .MuiGrid-container {
    padding-left: 4px;
    &:hover {
      color: #111;
      background-color: #f1f1f1;
    }
  }

`;

export const TextFieldStyled = styled(TextField)`
  label {
    font-size: 12px;
    line-height: 10px;
    &.MuiInputLabel-shrink {
      font-size: 14px;
      line-height: 18px;
    }
  }
  input {
    padding: 4px 12px;
    font-size: 12px;
  }
`;
