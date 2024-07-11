import { useState, useEffect } from 'react';
import CurrencyTextField from '~/components/CurrencyTextField';
import { useField } from 'formik';


const CurrencyTextFieldWrapper = ({ name, ...otherProps }) => {
  const [currencyValue, setCurrencyValue] = useState();
	const [field, meta, { setValue }] = useField(name)

  const {onChange: fieldOnChange, value, ...restFields} = field;

  useEffect(() => {
    setCurrencyValue(value);
  }, [value])

	const configTextField = {
		fullWidth: true,
		variant: 'outlined',
		...restFields,
		// "named" props above apply to all
		// Textfields present.
		// "otherProps" below will be custom tailored
		// to particular Text/Date etc. Fields
		// such as label, type, id, etc.
		...otherProps
	}

	// meta object containes
	// submitForm, isSubmitting, touched, errors
	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}

	return <CurrencyTextField
    onChange={(e, v) => {
      setCurrencyValue(v);
      setValue(v);
    }}
    value={currencyValue}
    {...configTextField}
  />
}

export default CurrencyTextFieldWrapper;
