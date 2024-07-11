import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { adminService } from '~/http/services'
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ArticlesList, Tags } from './tabs';
import { ARTICLES_SORT_VALUES } from '~/constants';

import { _, pushResponseMessages } from '~/utils';

const articlesTabsPanel = (props) => {
  const { data: { query = {} } } = props;
  const [value, setValue] = useState("0");
  const [articlesList, setArticlesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSort, setSelectedSort] = useState();
  const [queryParams, setQueryParams] = useState({
    tags: [],
    sort: 'updatedAtDesc',
  });

  const { t } = useTranslation(['sidebar', 'buttons', 'articles']);

  const router = useRouter();

  useEffect(() => {
    const { tags = '', sort = '' } = query;
    const filter = { tags: [], sort };
    if (tags) {
      const split = tags.split(',');
      const qTags = split.map(item => Number(item));
      if (qTags.length > 0) {
        filter.tags = qTags;
      } else {
        filter.tags = [];
      }
    }
    if (Object.values(ARTICLES_SORT_VALUES).includes(sort)) {
      filter.sort = sort;
    } else {
      filter.sort = ARTICLES_SORT_VALUES.UPDATED_AT_DESC;
    }

    setQueryParams(filter);
    getArticles(filter);
  }, [query]);

  const getArticles = async (values) => {
    const articlesResult = await adminService.getArticles(values);
    pushResponseMessages(articlesResult);
    if (articlesResult.ok) {
      const { articles, tags } = articlesResult;
      setArticlesList(articles);
      setTagsList(tags);
      const filteredTags = _.filter(tags, tag => values.tags.includes(tag.id))
      setSelectedTags(filteredTags);
      setSelectedSort(values.sort);
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue === "0") {
      getArticles(queryParams);
    }
    setValue(newValue);
  };

  const handleChangeArticlesTagFilter = (params) => {
    const { tags = [] } = params;
    const nextQueryParams = {
      ...queryParams,
      tags: tags.map(item => item.id),
    };
    setQueryParams(nextQueryParams);
    router.push(`/admin/articles_panel/?tags=${nextQueryParams.tags.join(',')}&sort=${nextQueryParams.sort}`);
  };

  const handleChangeArticlesSortFilter = (params) => {
    const { sort } = params;
    const nextQueryParams = {
      ...queryParams,
      sort,
    };

    setQueryParams(nextQueryParams);
    router.push(`/admin/articles_panel/?tags=${nextQueryParams.tags.join(',')}&sort=${nextQueryParams.sort}`);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', minHeight: '580px' }}>
      <TabContext value={value}>
        <Box sx={{ zIndex: 1, borderBottom: 1, borderColor: 'divider', backgroundColor: 'white' }}>
          <TabList onChange={handleChange} aria-label="tabs">
            <Tab
              style={{ fontSize: '14px', minWidth: '60px' }}
              label={t('articles_tab', { ns: 'articles' })}
              value="0"
            />
            <Tab
              style={{ fontSize: '14px', minWidth: '60px' }}
              label={t('tags', { ns: 'articles' })}
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="0" style={{ padding: '4px 12px' }}>
          <ArticlesList
            articlesList={articlesList}
            tagsList={tagsList}
            initTags={selectedTags}
            initSort={selectedSort}
            onChangeTags={handleChangeArticlesTagFilter}
            onChangeSort={handleChangeArticlesSortFilter}
          />
        </TabPanel>
        <TabPanel value="1" style={{ padding: '4px 12px' }}>
          <Tags tagsList={tagsList} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default articlesTabsPanel;
