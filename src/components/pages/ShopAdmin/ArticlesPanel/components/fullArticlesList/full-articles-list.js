import ArticleItem from "./article-item";
import { FullArticlesListStyled } from "./full-articles-list.styled";
import { _ } from '~/utils';


const FullArticlesList = (props) => {
  const { articlesList, tagsList} = props;

  return (
    <FullArticlesListStyled>
      {
        _.map(articlesList, (article, index) => {
          return (
            <div key={article.id}>
              <ArticleItem item={article} last={index === articlesList.length - 1} />
            </div>
          )
        })
      }
      {
        articlesList.length === 0 && (
          <div style={{fontSize: '14px', padding: '16px'}}>Not Found</div>
        )
      }
    </FullArticlesListStyled>
  )
};

export default FullArticlesList;
