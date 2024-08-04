import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { BottomDrawerStyled } from './bottom-drawer.styled';
import { FlexContainer } from '~/components/StyledComponents';

export default function BottomDrawer(props) {
  const {
    open = false,
    onClose,
    children,
    icon = null,
    title = '',
    titleContainer = null,
    transitionDuration = 200,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(open);

  const { t } = useTranslation(['buttons']);

  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    setDrawerOpen(open);
  }, [open]);

  const closeFilter = () => {
    setDrawerOpen(false);
    onClose();
  };

  return (
    <div>
      <BottomDrawerStyled
        anchor={'bottom'}
        open={drawerOpen}
        onClose={closeFilter}
        className="filter-wrapper"
        transitionDuration={transitionDuration}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: '960px',
            margin: 'auto',
          },
        }}
      >
        <Box
          sx={{ width: 'auto' }}
          role="presentation"
          style={{
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            height: '100%',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="filter-title">
            <FlexContainer jc="space-between">
              <FlexContainer>
                {icon}
                <span className="unselect" style={{ marginLeft: '5px', fontSize: '20px' }}>{title}</span>
              </FlexContainer>
              <div>{titleContainer}</div>
              <Button onClick={closeFilter}>{t('close', { ns: 'buttons' })}</Button>
            </FlexContainer>
          </div>

          <div style={{flexGrow: 1, overflowY: 'auto'}}>
          {children}
          </div>

        </Box>
      </BottomDrawerStyled>
    </div>
  );
};
