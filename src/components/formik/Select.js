import React from 'react';
import Select from '~/components/Select';
import { useField } from 'formik';

const SelectWrapper = ({ name, ...otherProps }) => {
	const [field, meta] = useField(name);

	const configSelectField = {
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
		configSelectField.error = true;
		configSelectField.helperText = meta.error;
	}

	return <Select {...configSelectField} />
}

export default SelectWrapper;
