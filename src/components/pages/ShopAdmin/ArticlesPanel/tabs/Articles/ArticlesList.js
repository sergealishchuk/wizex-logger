
import Link from '~/components/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'next-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { FlexContainer } from "~/components/StyledComponents";
import { TagsAutocomplete, FullArticlesList } from "../../components";
import { ArticlesListStyled } from "./ArticlesList.styled";
import { _ } from '~/utils';
import { MenuSelector } from '~/components/UI';

const sortItems = [
  {
    name: 'Created At: ASC',
    value: 'createdAtAsc'
  },
  {
    name: 'Created At: DESC',
    value: 'createdAtDesc'
  },
  {
    name: 'Updated At: ASC',
    value: 'updatedAtAsc'
  },
  {
    name: 'Updated At: DESC',
    value: 'updatedAtDesc'
  },
];

const ArticlesList = (props) => {
  const { tagsList, initTags, initSort = 'updatedAtDesc', articlesList, onChangeTags = _.noop, onChangeSort = _.noop } = props;

  const { t } = useTranslation(['buttons', 'articles']);

  const handleTagsChange = (tags) => {
    onChangeTags({ tags });
  };

  const handleSortChange = (sort) => {
    onChangeSort({ sort });
  };

  return (
    <ArticlesListStyled>
      <div>
        <TagsAutocomplete tagsList={tagsList} initTags={initTags} onChange={handleTagsChange} />
      </div>
      <div style={{ marginTop: '12px' }}>
        <FlexContainer style={{ borderBottom: '1px #e2e2e2 solid' }}>
          <div>
            <MenuSelector
              label={t('sort_by', { ns: 'articles' })}
              items={sortItems}
              defaultValue={initSort}
              disabled={articlesList.length < 2}
              style={{ fontSize: '11px' }}
              onChange={handleSortChange}
            />
          </div>
          <Link style={{ marginLeft: 'auto' }} href={`/admin/articles_panel/new`}>
            <Tooltip title={t('add_article', { ns: 'articles' })}>
              <IconButton color="primary">
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Link>
        </FlexContainer>
        <FullArticlesList articlesList={articlesList} />
      </div>
    </ArticlesListStyled>
  )
};

export default ArticlesList;
