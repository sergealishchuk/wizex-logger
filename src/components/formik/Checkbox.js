import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useField } from 'formik';

const CheckboxFieldWrapper = ({ name, label = '', ...otherProps }) => {
	const [field, meta, { setValue }] = useField(name);

	const configTextField = {
		// fullWidth: true,
		// variant: 'outlined',
		...field,
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

	return <FormControlLabel
		className="unselect"
		label={label}
		control={
			<Checkbox

				{...configTextField}
				checked={field.value}
				onChange={(e, v) => {
					setValue(v);
				}}
			/>
		}
	/>
}

export default CheckboxFieldWrapper;
