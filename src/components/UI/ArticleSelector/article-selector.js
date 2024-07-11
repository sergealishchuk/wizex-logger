import { useState, useEffect } from 'react';
import ArticleLine from './article-line';
import { adminService } from '~/http/services';
import { _ } from '~/utils';
import ArticleDrawer from './ArticleDrawer';

export default (props) => {
  const { articleId, error, touched, label, onSelect = _.noop } = props;
  const [openArticleDrawer, setOpenArticleDrawer] = useState(false);
  const [articleTitle, setArticleTitle] = useState();
  const [selectedArticle, setSelectedArticle] = useState();

  const getArticleById = async ({ articleId }) => {
    const resultArticle = await adminService.getArticle({ articleId });
    if (resultArticle.ok) {

      const { title } = resultArticle.data;
      setArticleTitle(title);
      setSelectedArticle(resultArticle.data);
    } else {
      setSelectedArticle(null);
    }
  };

  useEffect(() => {
    if (_.isNumber(articleId) && articleId > -1) {
      getArticleById({ articleId });
    } else {
      setArticleTitle('');
      setSelectedArticle(null);
    }
  }, [articleId]);

  const handleArticleLineClick = () => {
    setOpenArticleDrawer(true);
  };

  const handleCloseArticleDrawer = () => {
    setOpenArticleDrawer(false);
  };

  const handleArticleSelect = (articleId) => {
    onSelect(articleId);
  };

  return (
    <>
      <ArticleLine label={label} value={articleTitle} error={error} touched={touched} onClick={handleArticleLineClick} />
      <ArticleDrawer
        articleTitle={articleTitle}
        selectedArticle={selectedArticle}
        open={openArticleDrawer}
        onClose={handleCloseArticleDrawer}
        onArticleSelect={handleArticleSelect}
      />
    </>
  )
};
