import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import { ArticleBodyStyled } from "./article-body.styled";
import { _, getLocalDate } from '~/utils';
import { FlexContainer } from '~/components/StyledComponents';

export default (props) => {
  const { data: {
    title = '',
    body = '',
    tagsStr,
    createdAt,
    publishedAt
  } } = props;

  const { t } = useTranslation(['articles']);

  const bodyIsEmpty = typeof (body) === 'string' && body
    .replace(/[\r\n\s+]/g, '')
    .replace(/&nbsp;|<p>|<\/p>/g, '').length === 0;

  return (
    <Grid container>
      <Grid xs={12}>
        <div style={{ padding: '0 0 8px', borderBottom: '1px #e2e2e2 solid' }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px' }}>{title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              _.map(tagsStr, tag => (
                <span className="unselect" style={{ whiteSpace: 'nowrap', fontSize: '10px', margin: '2px 0px', backgroundColor: '#e1e1e1', padding: '0px 8px', borderRadius: '7px' }}>{tag}</span>
              ))
            }
          </div>
          <FlexContainer style={{ marginTop: '8px', fontSize: '9px' }} jc="space-between">
            <div>{t("createdAt", { ns: 'articles' })}: {getLocalDate(createdAt)}</div>
            <div>{t("publishedAt", { ns: 'articles' })}:  {getLocalDate(publishedAt)}</div>
          </FlexContainer>
        </div>
      </Grid>
      <Grid xs={12}>
        {
          !bodyIsEmpty
            ? <ArticleBodyStyled>
              <div className="cke_contents custom-editor-style" dangerouslySetInnerHTML={{ __html: body }} />
            </ArticleBodyStyled>
            : <div>{t("article_content_empty", { ns: 'articles' })}</div>
        }
      </Grid>
    </Grid>
  );
};
