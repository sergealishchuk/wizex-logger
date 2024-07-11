import { _ } from '~/utils';
import React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useField } from 'formik';

const SwitchFieldWrapper = ({ name, label = '', ...otherProps }) => {
	const [field, meta, { setValue }] = useField(name);

	const configTextField = {
		...field,
		...otherProps
	}

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}

	return <FormControlLabel
		className="unselect"
		label={label}
		control={
			<Switch
				{...configTextField}
				checked={_.isUndefined(field.value) ? false : field.value}
				inputProps={{ 'aria-label': 'controlled' }}
				onChange={(event, v) => {
					event.preventDefault();
					setValue(v);
				}}
			/>
		}
	/>
}

export default SwitchFieldWrapper;
