import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme, withoutTitle, closeIconDisable, width, disableActionsContainer }) => ({
	'& .MuiDialogContent-root': {
		maxWidth: width ? `${width}px` : '590px',
		padding: theme.spacing(2),
		borderTop: withoutTitle ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
	'& .MuiDialogTitle-root': {
		padding: withoutTitle ? (closeIconDisable ? '2px' : '14px') : '16px',
	}
}));

function BootstrapDialogTitle(props) {
	const { children, onClose, closeIconDisable, withoutTitle, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2, ml:2 }} {...other}>
			{!withoutTitle && children}
			{(onClose && !closeIconDisable) ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

export default function CustomizedDialogs(props) {
	const {
		title = '',
		children,
		onClose,
		closeIconDisable,
		withoutTitle,
		openDialog,
		forceClose = false,
		dialogActionsContainer,
		width,
		...rest
	} = props;

	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(openDialog);
		if (!openDialog && typeof (onClose) === "function") {
			onClose();
		}
	}, [openDialog]);

	useEffect(() => {
		if (forceClose) {
			handleClose();
		}
	}, [forceClose]);

	const handleClose = (event, reason) => {
		if (reason && reason == "backdropClick") {
			return;
		} else {
			setOpen(false);
			if (typeof (onClose) === "function") {
				onClose();
			}
		}
	};

	return (
		<div>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				withoutTitle={withoutTitle}
				closeIconDisable={closeIconDisable}
				width={width}
			>
				<BootstrapDialogTitle
					id="customized-dialog-title"
					onClose={handleClose}
					withoutTitle={withoutTitle}
					closeIconDisable={closeIconDisable}
				>
					{title}
				</BootstrapDialogTitle>
				<DialogContent dividers>
					{children}
				</DialogContent>
				{dialogActionsContainer}
			</BootstrapDialog>
		</div>
	);
};
