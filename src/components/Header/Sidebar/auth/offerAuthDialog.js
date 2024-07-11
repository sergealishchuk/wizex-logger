import { _ } from '~/utils';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import styledEmo from '@emotion/styled';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Dialog from '~/components/Dialog';
import Observer from '~/utils/observer';
import { useTranslation } from 'next-i18next';

const ForwardButtonStyled = styledEmo(Button)`
	.MuiButton-endIcon {
		margin-left: 2px;
	}
`;

export default function OfferAuthDialog(props) {
  const {
    offerAuthParams,
    ...rest
  } = props;

  const [closeDialog, setCloseDialog] = useState(false);
  const { t } = useTranslation(['sidebar']);

  const firstname = _.get(offerAuthParams, 'params.firstname', 'User');

  const handleClose = () => {
    setCloseDialog(true);
    setTimeout(() => setCloseDialog(false), 100);
  };

  const handleRegistration = () => {
    Observer.send('OpenSignInDialog', { action: 'registration' }, () => {
      const { cb } = offerAuthParams;
      if (cb && _.isFunction(cb)) {
        cb({ action: 'signin' });
      }
      handleClose();
    });
  };

  const handleSignIn = () => {
    Observer.send('OpenSignInDialog', { action: 'signin' }, () => {
      const { cb } = offerAuthParams;
      if (cb && _.isFunction(cb)) {
        cb({ action: 'signin' });
      }
      handleClose();
    });
  };

  const handleContinue = () => {
    const { cb } = offerAuthParams;
    if (cb && _.isFunction(cb)) {
      cb({ action: 'continue' });
    }
    handleClose();
  };

  const actions = (
    <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '16px' }}>
      <Grid container>
        <Grid item xs={12} md={4} style={{textAlign: 'center'}}>
          <Button onClick={handleClose}>
            {t('auth.buttons.cancel', { ns: 'sidebar' })}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} style={{textAlign: 'center'}}>
          <Button  onClick={handleRegistration}>
            {t('auth.buttons.registration', { ns: 'sidebar' })}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} style={{textAlign: 'center'}}>
          <Button onClick={handleSignIn}>
            {t('auth.buttons.sign_in', { ns: 'sidebar' })}
          </Button>
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <ForwardButtonStyled endIcon={<ArrowForwardIosIcon />} onClick={handleContinue}>
            {t('auth.buttons.continue', { ns: 'sidebar' })}
          </ForwardButtonStyled>
        </Grid> */}
      </Grid>
    </DialogActions>
  );

  return (
    <Dialog
      title={t('auth.invate_register', { ns: 'sidebar' })}
      forceClose={closeDialog}
      {...rest}
      style={{ width: '400px' }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: '0 20px' }}>
        <Grid item xs={12}>
          <div style={{ paddingBottom: '12px' }}>{`${t('auth.dear', { ns: 'sidebar' })} ${firstname}`}</div>
          <div>{t('auth.offer_auth', { ns: 'sidebar' })}</div>
        </Grid>
        <Grid item xs={12}>
          {actions}
        </Grid>
      </Grid>
    </Dialog>
  )
};
