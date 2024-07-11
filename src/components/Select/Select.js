import { _ } from '~/utils';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

/*

import { useState } from 'react';
import Select from '~/components/Select';

...

const [selectValue, setSelectValue] = useState(-1);

const items = [
  {
    id: 1,
    name: 'First category'
  },
  {
    id: 2,
    name: 'Second category'
  },
  ...
];

const handleSelectChange  = (event) => {
  setSelectValue(event.target.value);
};
...

<Select
  firstItemName = 'All Categories'
  label = "Category"
  onChange = {handleSelectChange}
  items = {items}
/>    
*/

const StyledSelect = styled('div')((props) => ({
  ".MuiFormControl-root": {
    width: '100%',
    margin: '0 0px',
    "&.has-error": {
      "label": {
        color: '#ff1744'
      },
      ".MuiSelect-select": {
        color: '#ff1744'
      }
    }
  },
  ".MuiSelect-select": {
    padding: '9px 6px 9px 12px',
    fontSize: '16px',
  },
  ".MuiFormLabel-root": {
    fontSize: '16px',
    lineHeight: '22px',
  },
}));

export default function CustomSelect(props) {
  const {
    firstItemName = 'Select...',
    label = "select",
    value = -1,
    onChange = _.noop,
    minWidth = 170,
    items = [],
    fullWidth = true,
    targetOption = 'name',
    onlyValues = false,
    ...rest
  } = props;
  const { error, helperText } = rest;
  const [selectedOption, setSelectedOption] = useState(value);
  const [openDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    onChange({ value: selectedOption });
  }, [selectedOption]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value])

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleClose = () => {
    setOpenDropDown(false);
  };

  const handleOpen = () => {
    setOpenDropDown(true);
  };

  return (
    <StyledSelect>
      <FormControl className={cn({ 'has-error': error })} sx={{ m: 1, minWidth }}>
        <InputLabel id="demo-controlled-open-select-label">{label}</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={openDropDown}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectedOption}
          label={label}
          onChange={handleChange}
          {...rest}
        >
          {!onlyValues && (
            <MenuItem style={{ fontSize: '16px' }} value={-1}>
              <em style={{ color: '#959ba2' }}>{firstItemName}</em>
            </MenuItem>
          )}
          {_.map(items, item => (
            <MenuItem style={{ fontSize: '16px' }} key={item.id} value={item.id}>{item[targetOption]}</MenuItem>
          ))}
        </Select>

      </FormControl>
      {rest.error && (
        <p style={{
          backgroundColor: 'transparent',
          color: '#ff1744',
          margin: '4px 0 0 12px',
          fontSize: '12px'
        }}>{rest.helperText}</p>
      )}
    </StyledSelect>
  );
};
