import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import cn from 'classnames';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArticleIcon from '@mui/icons-material/Article';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { adminService } from '~/http/services';
import { ArticleDrawerStyled, ArticleViewer } from './article-drawer.styled';
import { FlexContainer } from '~/components/StyledComponents';
import SearchArticleLine from './search-article-line';
import { TagsAutocomplete } from '~/components/pages/ShopAdmin/ArticlesPanel/components';
import FullArticlesList from '../fullArticlesList';

import { _, pushResponseMessages, searchCatalogFilter } from '~/utils';
import ArticleBody from '../ArticleBody/article-body';

export default function CategoryDrawer(props) {
  const {
    open = false,
    onClose,
    onArticleSelect = _.noop,
    selectedArticle,
    articleTitle,
  } = props;

  const [filterOpen, setFilterOpen] = useState(open);
  const [scrollShadow, setScrollShadow] = useState(false);
  const [selectedTags, setSelectedTags] = useState();
  const [searchText, setSearchText] = useState();
  const [articlesList, setArticlesList] = useState();
  const [showArticle, setShowArticle] = useState(false);
  const [showArticleItem, setShowArticleItem] = useState();

  const [tagsList, setTagsList] = useState();
  const [tagsListMap, setTagsListMap] = useState();

  const { t } = useTranslation(['articles', 'buttons']);

  const router = useRouter();

  const getArticleTagsRequest = async () => {
    const articlesTagsResult = await adminService.getArticlesTags();
    pushResponseMessages(articlesTagsResult);
    if (articlesTagsResult.ok) {
      const { tags, tagsMap } = articlesTagsResult;
      setTagsList(tags);
      setTagsListMap(tagsMap);
    }
  };

  const sendSearchRequest = async (values) => {
    const { text, tags } = values;
    const searchResult = await adminService.searchArticle({
      text,
      tags: tags.map(item => item.id),
    });

    if (searchResult.ok) {
      const { listResult } = searchResult;
      setArticlesList(listResult);
    }
  };

  useEffect(() => {
    setFilterOpen(open);
    if (open) {
      getArticleTagsRequest();
      sendSearchRequest({
        text: '',
        tags: [],
      });
    } else {
      setSelectedTags(undefined);
      setSearchText(undefined);
      setArticlesList(undefined);
      setShowArticle(false);
      setShowArticleItem(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!_.isUndefined(searchText) && !_.isUndefined(selectedTags)) {
      sendSearchRequest({
        text: searchText,
        tags: selectedTags,
      });
    }
  }, [searchText, selectedTags]);

  const closeFilter = () => {
    setFilterOpen(false);
    onClose();
  };

  const handleScrollContent = (event) => {
    const { scrollTop } = event.target;
    setScrollShadow(scrollTop > 0);
  };

  const handleSelectArticle = (articleId) => {
    onArticleSelect(articleId);
    onClose();
  };

  const handleClearCategory = () => {
    onArticleSelect(-1);
    onClose();
  };

  const handleSendSearchRequest = ({ text }) => {
    if (_.isUndefined(selectedTags)) {
      setSelectedTags([]);
    }
    setSearchText(text);
  };

  const handleTagsChange = (tags) => {
    if (_.isUndefined(searchText)) {
      setSearchText('');
    }
    setSelectedTags(tags);
  };

  const handleSlhowArticle = (articleItem) => {
    if (articleItem) {
      setShowArticleItem(articleItem);
      setShowArticle(true);
    }
  };

  const handleCloseViewArticle = () => {
    setShowArticle(false);
  };

  const handleSelectArticleFromView = () => {
    const { id: articleId } = showArticleItem;
    handleSelectArticle(articleId);
  };

  const handleViewActualArticle = () => {
    if (selectedArticle) {
      handleSlhowArticle(selectedArticle);
    }
  };

  return (
    <div>
      <ArticleDrawerStyled
        anchor={'bottom'}
        open={filterOpen}
        onClose={closeFilter}
        className="filter-wrapper"
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
              {
                showArticle
                  ? <IconButton onClick={handleCloseViewArticle}>
                    <ArrowBackIosIcon style={{ marginLeft: '2px', fontSize: '17px' }} />
                  </IconButton>
                  : <FlexContainer>
                    <ArticleIcon style={{ color: '#868686' }} />
                    <span className="unselect" style={{ whiteSpace: 'nowrap', textAlign: 'left', marginLeft: '5px', fontSize: '18px' }}>
                      {t('select_article', { ns: 'articles' })}
                    </span>
                  </FlexContainer>
              }
              {showArticle && <div>{t('view_article', { ns: 'articles' })}</div>}
              {
                showArticle
                  ? <Button onClick={handleSelectArticleFromView}>{t('select', { ns: 'buttons' })}</Button>
                  : (
                    <FlexContainer>
                      <Button disabled={!Boolean(articleTitle)} onClick={handleClearCategory}>{t('clear', { ns: 'buttons' })}</Button>
                      <Button onClick={closeFilter}>{t('close', { ns: 'buttons' })}</Button>
                    </FlexContainer>
                  )
              }
            </FlexContainer>
          </div>
          <FlexContainer column style={{ overflow: 'hidden' }}>
            <FlexContainer style={{ width: '100%' }} className={cn("info-line", { "scroll-shadow": scrollShadow })} jc="space-between">
              <FlexContainer style={{ minWidth: 0 }}>
                <div style={{ whiteSpace: 'nowrap', marginRight: '4px' }}>{t('article_title', { ns: 'articles' })}: </div>
                <div style={{
                  marginRight: '16px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  fontSize: !articleTitle ? '12px' : '16px',
                  color: !articleTitle ? '#989898' : '#333',
                  fontStyle: !articleTitle ? 'italic' : 'normal',
                  fontWeight: !articleTitle ? 'normal' : 'bold',
                }}>
                  {articleTitle
                    ? <span style={{ cursor: 'pointer' }} onClick={handleViewActualArticle}>{articleTitle}</span>
                    : t('not_selected', { ns: 'articles' })}
                </div>
              </FlexContainer>
            </FlexContainer>
            <div style={{ width: '100%', padding: '0 32px', margin: '0 16px' }}>
              <TagsAutocomplete tagsList={tagsList} initTags={selectedTags} onChange={handleTagsChange} />
              <SearchArticleLine open={filterOpen} sendSearchRequest={handleSendSearchRequest} />
            </div>

            <div className="filter-content" style={{ flexGrow: 1, overflowY: 'auto', width: '100%', height: '100%' }}>
              <div onScroll={handleScrollContent} style={{
                display: 'flex',
                overflowY: 'auto',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}>
                {
                  articlesList && (
                    <FullArticlesList
                      tagsListMap={tagsListMap}
                      articlesList={articlesList}
                      selectedArticle={selectedArticle}
                      onShowArticle={handleSlhowArticle}
                      onSelectArticle={handleSelectArticle}
                    />
                  )
                }
              </div>
            </div>
          </FlexContainer>
          <ArticleViewer
            className={cn({ "show": showArticle })}
          >
            {
              showArticle && <ArticleBody
                data={showArticleItem}
              />
            }
          </ArticleViewer>
        </Box>
      </ArticleDrawerStyled>
    </div >
  );
};
