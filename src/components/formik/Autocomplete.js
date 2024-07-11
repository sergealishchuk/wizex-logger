import {useState, useEffect} from 'react';
import cn from 'classnames';
//import Select from '~/components/Select';
import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import { setNestedObjectValues, useField } from 'formik';
import { _ } from '~/utils';

const AutocompleteStyled = styled('div')`

  .MuiFormControl-root {
    width: 100%;
    margin: 0;
    &.has-error {
      label {
        color: #ff1744;
      }
      .MuiSelect-select {
        color: #ff1744;
      }
      fieldset {
        border-color: #ff1744;
      }
    }
    .MuiAutocomplete-root {
      width: 100%;
    }
  }
`;

const AutocompleteWrapper = ({ name, value:valueInput, inputValue:inputValueInput, onChange = _.noop, ...otherProps }) => {
  const [field, meta, { setValue }] = useField(name);
  const [autoValue, setAutoValue] = useState(valueInput);
  const [autoInputValue, setAutoInputValue] = useState(inputValueInput);

  useEffect(() => {
    setAutoInputValue(inputValueInput);
    setAutoValue(valueInput);
  }, [valueInput, inputValueInput]);

  const configAutocompleteField = {
    ...field,
    // "named" props above apply to all
    // Textfields present.
    // "otherProps" below will be custom tailored
    // to particular Text/Date etc. Fields
    // such as label, type, id, etc.
    ...otherProps,
    value: autoValue,
    inputValue: autoInputValue,
  }

  // meta object containes
  // submitForm, isSubmitting, touched, errors
  if (meta && meta.touched && meta.error) {
    configAutocompleteField.error = true;
    configAutocompleteField.helperText = meta.error;
  }

  const hasError = meta && meta.touched && meta.error;

  const handleOnChange = (...args) => {
    const res = onChange(...args);
    if (res) {
      setValue(args[1]);
    };
  };

  return (
    <AutocompleteStyled>
      <FormControl className={cn({ 'has-error': hasError })} sx={{ m: 1 }}>
        <Autocomplete {..._.omit(configAutocompleteField, ['onChange'])} onChange={handleOnChange}/>
      </FormControl>
      {hasError && (
        <p style={{
          backgroundColor: 'transparent',
          color: '#ff1744',
          margin: '4px 0 0 12px',
          fontSize: '12px'
        }}>{meta.error}</p>
      )}
    </AutocompleteStyled>
  )
}

export default AutocompleteWrapper;
