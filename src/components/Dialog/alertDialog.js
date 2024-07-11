import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';

const DialogStyled = styled(Dialog)(({ width }) => ({
	'& .MuiDialogContent-root': {
		maxWidth: width ? `${width}px` : '590px',
	}
}));

export default function AlertDialog(props) {
  const { children, title, text, open = false, handleClose, ...rest } = props;

  return (
    <DialogStyled
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      <div className="title-dialog" style={{ padding: '12px 16px', fontSize: '20px', borderBottom: '1px #dedede solid' }}>
        {title}
      </div>
      <DialogContent className="text-dialog" style={{padding: '12px 18px'}}>
        {text}
      </DialogContent>
      <DialogActions style={{borderTop: '1px #dedede solid', marginTop: '12px', padding: '16px 24px'}}>
        {children}
      </DialogActions>
    </DialogStyled>
  );
};
