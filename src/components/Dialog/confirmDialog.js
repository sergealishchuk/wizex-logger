import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material/styles';
import { DIALOG_ACTIONS } from '~/constants';

const DialogStyled = styled(Dialog)(({ width, minWidth }) => ({
  '& .MuiDialogContent-root': {
    maxWidth: width ? `${width}px` : '590px',
    minWidth: minWidth ? `${minWidth}px` : '300px',
  }
}));

export default function ConfirmDialog(props) {
  const { children, open = false, ...rest } = props;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [callback, setCallback] = useState(() => () => null);
  const [text, setText] = useState('text');

  const { t } = useTranslation(['sidebar', 'buttons']);

  useEffect(() => {
    const openConfirmDialog = Observer.addListener(
      'OpenConfirmDialog',
      (params = {}, cb) => {
        const { text } = params;
        if (text) {
          setText(text);
        }
        setOpenConfirmDialog(true);
        setCallback(() => () => cb);
      });

    return () => {
      Observer.removeListener(openConfirmDialog);;
    }
  }, []);

  const handleClose = () => {
    setOpenConfirmDialog(false);
    callback()(DIALOG_ACTIONS.CANCEL);
  };

  const handleConfirm = () => {
    setOpenConfirmDialog(false);
    callback()(DIALOG_ACTIONS.CONFIRM);
  };

  return (
    <DialogStyled
      open={openConfirmDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      minWidth={300}
      {...rest}
    >
      <div className="title-dialog" style={{ padding: '12px 16px', fontSize: '20px', borderBottom: '1px #dedede solid' }}>
        {t('auth.please_confirm', { ns: 'sidebar' })}
      </div>
      <DialogContent className="text-dialog" style={{ padding: '12px 18px' }}>
        {text}
      </DialogContent>
      <DialogActions style={{ borderTop: '1px #dedede solid', marginTop: '12px', padding: '16px 24px' }}>
        <Button onClick={() => { handleConfirm() }} autoFocus>
          {`${t('confirm', { ns: 'buttons' })}`}
        </Button>
        <Button onClick={() => { handleClose() }} autoFocus>
          {`${t('cancel', { ns: 'buttons' })}`}
        </Button>
      </DialogActions>
    </DialogStyled>
  );
};
