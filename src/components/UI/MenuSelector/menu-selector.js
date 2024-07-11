
import { useState, useEffect } from 'react';
import { _ } from '~/utils';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { MenuSelectorStyled } from './menu-selector.styled';

export default (props) => {
  const { items = [], label, defaultValue, onChange, disabled } = props;
  const [openStatus, setOpenStatus] = useState(false);
  const [menuValue, setMenuValue] = useState(defaultValue);

  useEffect(() => {
    setMenuValue(defaultValue);
  }, [defaultValue]);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setMenuValue(value);
    onChange(value);
  };

  const handleStatusClose = () => {
    setOpenStatus(false);
  };

  const handleStatusOpen = () => {
    setOpenStatus(true);
  };

  return (
    <MenuSelectorStyled>
      <FormControl className="status" sx={{ m: 1 }}>
        <InputLabel shrink={true} id="demo-controlled-open-select-label-2">{label}</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label-2"
          disabled={disabled}
          open={openStatus}
          onClose={handleStatusClose}
          onOpen={handleStatusOpen}
          value={menuValue || null}
          label={label}
          notched={true}
          onChange={handleStatusChange}
        >
          {
            _.map(items, item => {
              return (
                <MenuItem style={{ fontSize: '14px' }} value={item.value}>
                  {item.name}
                </MenuItem>
              )
            })
            
          }
        </Select>
      </FormControl>
    </MenuSelectorStyled>
  )
};
