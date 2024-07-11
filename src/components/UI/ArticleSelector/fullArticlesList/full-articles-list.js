import cn from 'classnames';
import ArticleItem from "./article-item";
import { useTranslation } from 'next-i18next';
import { FullArticlesListStyled } from "./full-articles-list.styled";
import { _ } from '~/utils';

const FullArticlesList = (props) => {
  const { articlesList = [], tagsListMap = [], selectedArticle = {}, onShowArticle = _.noop, onSelectArticle = _.noop } = props;

  const { t } = useTranslation(['articles']);

  return (
    <FullArticlesListStyled>
      {
        _.map(articlesList, (article, index) => {
          const tagsStrList = _.map(article.tags, item => tagsListMap[item]);
          return (
            <div key={article.id} className={cn('fixxx', {selected: selectedArticle && (selectedArticle.id === article.id)})}>
              <ArticleItem onSelectArticle={onSelectArticle} tagsStrList={tagsStrList} item={article} last={index === articlesList.length - 1} onShowArticle={onShowArticle} />
            </div>
          )
        })
      }
      {
        articlesList.length === 0 && (
          <div style={{ marginLeft: '10px', fontSize: '14px', padding: '16px' }}>{t('not_found', {ns: 'articles'})}</div>
        )
      }
    </FullArticlesListStyled>
  )
};

export default FullArticlesList;
