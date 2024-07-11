import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';

const TextFieldStyled = styled(TextField)(({ theme, props }) => ({
	"MuiInputBase-root.Mui-focused": {
		".MuiInputBase-input": {
			backgroundColor: 'blue'
		}
	},
	"& .MuiInputBase-input:disabled": {
		backgroundColor: "white"
	},
	"& .MuiFilledInput-root:hover": {
		backgroundColor: "rgb(250, 232, 241)",
		"@media (hover: none)": {
			backgroundColor: "rgb(232, 241, 250)"
		}
	},
}));

const TextFieldWrapper = ({ name, className, onValueChanged, ...otherProps }) => {
	const [field, meta, { setValue }] = useField(name);

	const configTextField = {
		fullWidth: true,
		variant: 'outlined',
		...field,
		...otherProps
	}

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}

	return (
		<div style={{ position: 'relative' }} className={className}>
			<TextFieldStyled
				size="small"
				autoComplete="off"
				spellCheck="false"
				{...configTextField}
				onChange={(...args) => {
					const [event] = args;
					event.preventDefault();
					const { value } = event.target;
					configTextField.onChange(...args);
					if (typeof (onValueChanged) === 'function') {
						onValueChanged(value);
					}
				}}
			/>
			<div style={{
				display: configTextField.disabled ? 'block' : 'none',
				backgroundColor: 'transparent',
				padding: '4px',
				position: 'absolute',
				Zindex: 2,
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			}} />
		</div>
	);
}

export default TextFieldWrapper;
