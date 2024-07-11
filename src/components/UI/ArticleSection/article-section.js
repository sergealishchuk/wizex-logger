import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';
import { SectionTitle } from '~/components/UI';
import { ArticleSectionStyled } from "./article-section.styled";

export default (props) => {
  const { title = '', subTitle = '', body = '' } = props;

  const { t } = useTranslation(['articles']);

  const [open, setOpen] = useState(false);
  const [disableMoreLessBehavior, setDisabelMoreLessBehavior] = useState(true);

  const articleContainer = useRef(null);

  const bodyIsEmpty = typeof (body) === 'string' && body
    .replace(/[\r\n\s+]/g, '')
    .replace(/&nbsp;|<p>|<\/p>/g, '').length === 0;

  useEffect(() => {
    if (articleContainer && articleContainer.current) {
      const offsetHeight = articleContainer.current.offsetHeight;
      if (offsetHeight > 80) {
        setDisabelMoreLessBehavior(false);
      }
    }
  }, []);

  const handleOpenSection = () => {
    setOpen(!open);
  };

  return !bodyIsEmpty ? (
    <Grid container style={{ width: '100%', marginTop: '16px' }}>
      <Grid xs={12}>
        <SectionTitle icon={<InfoIcon />} text={
          <div>
            <h1>{title}</h1>
            {subTitle && <div style={{ fontSize: '10px', lineHeight: '9px' }}>{subTitle}</div>}
          </div>
        } />
      </Grid>
      <Grid xs={12} style={{ position: 'relative' }}>
        <ArticleSectionStyled className={cn({ open })}>
          <div ref={articleContainer} className="cke_contents custom-editor-style" dangerouslySetInnerHTML={{ __html: body }} />
          {
            !disableMoreLessBehavior &&
            (
              <div onClick={handleOpenSection} className="read-more-less-block">
                {
                  open
                    ? t('read_less', { ns: 'articles' })
                    : t('read_more', { ns: 'articles' })
                }
              </div>
            )
          }
        </ArticleSectionStyled>
      </Grid>
    </Grid>
  ) : null;
};
