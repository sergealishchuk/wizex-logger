import { styled } from '@mui/material/styles';

export const MenuSelectorStyled = styled('div')(() => ({
  "min-width": '20px',
  ".MuiFormControl-root": {
    margin: '0 8px',
    backgroundColor: '#f4f4f4',
    "&.status": {
      marginRight: '2px',
    },
  },
  ".MuiSelect-select": {
    padding: '4px 6px 2px 8px',
    fontSize: '14px',
  },
  ".MuiFormLabel-root": {
    fontSize: '12px',
    lineHeight: '24px',
  },

  'label.Mui-focused': {
    color: 'gray',
  },
  '.MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#dfdfdf',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dfdfdf',
    }
  },
}));
