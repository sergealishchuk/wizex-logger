
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useField, useFormikContext } from "formik";
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';

const DateStyled = styled.div`
  display: flex;
  width: 170px;
  cursor: default;
  .MuiInputBase-root {
    padding-right: 24px;
    font-size: 1rem;
    input {
      margin-top: 1px;
      padding: 4px 12px;
      cursor: text;
    }
  }
  .icon-button-calendar {
    margin-left: -31px;
    margin-top: 0;
    svg {
      color: #1b6fb7;
      font-size: 17px;
      color: #1b6fb7;
    }
  }
  
  .MuiInputAdornment-root {
    display: none;
  }
`;


/*
const DateStyled = styled.div`
  display: flex;
  width: 120px;
  cursor: default;
  .MuiInputBase-root {
    padding-right: 24px;
    font-size: 0.75rem;
    input {
      margin-top: 1px;
      padding: 4px 12px;
      cursor: text;
    }
  }
  .icon-button-calendar {
    margin-left: -28px;
    margin-top: -3px;
    svg {
      color: rgb(27, 111, 183);
      font-size: 15px;
      color: #1b6fb7;
    }
  }
  
  .MuiInputAdornment-root {
    display: none;
  }
`;
*/

const FormikDatePicker = (props) => {
  const { name, ...restProps } = props;

  const [open, setOpen] = useState(false);
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleOpenPopup = () => {
    setOpen(true);
  }
  return (
    <DateStyled>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...restProps}
          value={field.value ?? null}
          onChange={(val) => {
            setFieldValue(name, val);
            setOpen(false);
          }}
          open={open}
          onClose={() => setOpen(false)}
        />
        <IconButton className="icon-button-calendar" onClick={handleOpenPopup}>
          <InsertInvitationIcon />
        </IconButton>
      </LocalizationProvider>
    </DateStyled>
  );
};

export default FormikDatePicker;
