import { _ } from '~/utils';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import styledEmo from '@emotion/styled';
import Dialog from '~/components/Dialog';
import { useTranslation } from 'next-i18next';
import { FlexContainer } from '~/components/StyledComponents';

const AboutDialogStyled = styledEmo(Dialog)`
  .MuiTypography-root {
    background: #556cd6;
    display: flex;
    justify-content: center;
  }
`;

export default function AboutDialog(props) {
  const { openAboutDialog, setOpenAboutDialog } = props;
  const [buildInfo, setBuildInfo] = useState([]);

  const { t } = useTranslation(['sidebar']);

  useEffect(() => {
    const build = `${_BUILD_VERSION_} [${APP_ENV}]`;
    if (typeof (build) === 'string') {
      const splitBuild = build.split(' - ');
      const splitDateEnv = splitBuild[2].split(' ');

      setBuildInfo([
        splitBuild[0],
        splitBuild[1],
        `${splitDateEnv[0]} ${splitDateEnv[1]}`,
        splitDateEnv[2],
      ]);
    }
  }, []);

  const handleClose = () => {
    setOpenAboutDialog(false);
  };

  const actions = (
    <DialogActions sx={{ borderTop: '1px #e2e2e2 solid', width: '100%', marginTop: '4px' }}>
      <Grid container>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleClose} style={{ marginTop: '8px' }}>
            {t('close', { ns: 'sidebar' })}
          </Button>
        </Grid>
      </Grid>
    </DialogActions>
  );

  return (
    <AboutDialogStyled
      closeIconDisable
      withoutTitle
      openDialog={openAboutDialog}
      style={{ width: '400px' }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: '0 20px' }}>
        <Grid item xs={12}>
          <div style={{ paddingBottom: '24px', textAlign: 'center', fontSize: '20px' }}>Wizex Project</div>
          <FlexContainer column>
            <div>{`${t('branch', { ns: 'sidebar' })}: ${buildInfo[0]}`}</div>
            <div>{`${t('commit', { ns: 'sidebar' })}: ${buildInfo[1]}`}</div>
            <div>{`${t('date_commit', { ns: 'sidebar' })}: `}<span style={{ fontSize: '14px' }}>{`${buildInfo[2]}`}</span></div>
            <div><div>{buildInfo[3]}</div></div>
          </FlexContainer>
        </Grid>
        <Grid item xs={12}>
          {actions}
        </Grid>
      </Grid>
    </AboutDialogStyled>
  )
};
