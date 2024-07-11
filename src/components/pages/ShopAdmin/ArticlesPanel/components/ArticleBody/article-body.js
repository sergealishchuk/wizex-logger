import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'next-i18next';
import { ArticleBodyStyled } from "./article-body.styled";
import { TagsList } from '../';
import hljs from 'highlight.js';

export default (props) => {
  const { data: { articleTitle = '', body = '' }, tagsListMap, tagsArr } = props;

  const { t } = useTranslation(['articles']);

  useEffect(() => {
    hljs.highlightAll();
  }, [body]);

  const bodyIsEmpty = typeof (body) === 'string' && body
    .replace(/[\r\n\s+]/g, '')
    .replace(/&nbsp;|<p>|<\/p>/g, '').length === 0;

  return (
    <Grid container>
      <Grid xs={12}>
        <div style={{ padding: '0 0 8px', borderBottom: '1px #e2e2e2 solid' }}>
          <div style={{ fontSize: '32px' }}>{articleTitle}</div>
          <div>
            <TagsList tagsListMap={tagsListMap} tagsArr={tagsArr} />
          </div>
        </div>
      </Grid>
      <Grid xs={12}>
        {
          !bodyIsEmpty
            ? <ArticleBodyStyled>
              <div style={{ textAlign: 'left', marginBottom: '40px', paddingRight: '16px' }}>
                <div className="cke_contents custom-editor-style" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            </ArticleBodyStyled>
            : <div>{t("article_content_empty", {ns: 'articles'})}</div>
        }
      </Grid>
    </Grid>
  );
};
