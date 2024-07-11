import { useEffect, useState } from 'react';
import { _ } from '~/utils';
import styled from '@emotion/styled';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import Observer from '~/utils/observer';
import { DIALOG_ACTIONS } from '~/constants';

const { CANCEL, LEAVE_AND_DISCARD } = DIALOG_ACTIONS;

const DialogStyled = styled(Dialog)`
  &.full .MuiPaper-root {
    max-width: 400px;
  }
`;

export default function ConfirmLeavePageDialog(props) {
  const { children, title, text, handleClose, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [isLocaleChange, setIsLocaleChange] = useState(false);
  const [callback, setCallback] = useState(() => () => null);
  const { t } = useTranslation(['admin_slider', 'buttons']);

  useEffect(() => {
    const openConfirmLeavePageDialog = Observer.addListener(
      'OpenConfirmLeavePageDialog',
      (params, cb) => {
        const { isLocaleChange } = params;
        setIsLocaleChange(isLocaleChange);
        setOpen(true);
        // Todo: Need to describe this solution in the documenation!
        setCallback(() => () => cb);
      });

    return () => {
      Observer.removeListener(openConfirmLeavePageDialog);
    }
  }, []);

  const handleCancel = () => {
    callback()(CANCEL);
    setOpen(false);
  };

  const handleSaveAndDiscard = () => {
    callback()(LEAVE_AND_DISCARD);
    setOpen(false);
  };

  const defaultChildren = (
    <Grid container style={{width: '100%', padding: '0 16px'}}>
      <Grid item xs={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button variant="outlined" color="success" onClick={handleSaveAndDiscard}>
          {t(isLocaleChange ? 'discard_changes_with_locale' : 'discard', { ns: 'buttons' })}
        </Button>
      </Grid>
      <Grid item xs={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button variant="outlined" onClick={handleCancel}>
          {t('cancel_close', { ns: 'buttons' })}
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <DialogStyled
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="full"
      {...rest}
    >
      <div style={{ padding: '16px 24px 10px 24px', fontSize: '20px' }}>
        {t('unsaved_changes', { ns: 'buttons' })}
      </div>
      <DialogContent style={{ borderBottom: '1px gray solid' }}>
        <div>
          {t(isLocaleChange ? 'unsaved_changes_with_locale' : 'unsaved_changes_text', { ns: 'buttons' })}
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '12px 0' }}>
        {defaultChildren}
      </DialogActions>
    </DialogStyled>
  );
};
