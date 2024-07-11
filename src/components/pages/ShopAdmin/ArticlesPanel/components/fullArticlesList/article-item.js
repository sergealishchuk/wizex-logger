import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { FlexContainer } from "~/components/StyledComponents";
import { ArticleItemStyled } from './full-articles-list.styled';

const ArticleItem = (props) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  return (
    <ArticleItemStyled href={`/admin/articles_panel/view/${item.id}`} style={{ borderBottom: !last ? '1px #e2e2e2 solid' : 'none' }}>
      <FlexContainer jc="space-between">
        <Link style={{ paddingRight: '10px' }} href={`/admin/articles_panel/view/${item.id}/?type=original`}>
          {item.title}
        </Link>
        <Link href={`/admin/articles_panel/edit/${item.id}`}>
          <Tooltip title={t(item.bodyEdited !== null ? 'continue_edit' : 'edit', { ns: 'articles' })}>
            <span>
              <BorderColorIcon style={{ fontSize: '14px', color: 'brown', border: item.bodyEdited !== null ? '1px brown solid' : 'none', borderRadius: '10px' }} />
            </span>
          </Tooltip>
        </Link>
      </FlexContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          _.map(item.tags, tag => (
            <span className="unselect" style={{ whiteSpace: 'nowrap', fontSize: '10px', margin: '2px 3px', backgroundColor: '#e1e1e1', padding: '0px 8px', borderRadius: '7px' }}>{tag}</span>
          ))
        }
      </div>
      <FlexContainer jc="space-between" className="dates-change">
        <FlexContainer>
          <AddCircleOutlineIcon style={{ fontSize: '9px' }} />
          <span style={{ marginLeft: '4px', lineHeight: '9px' }}>{getLocalDate(item.createdAt)}</span>
          {
            item.published
              ?
              <div style={{ marginLeft: '16px', height: '11px', borderRadius: '5px', padding: '0 8px', fontSize: '9px', backgroundColor: 'green', color: 'white' }}>
                <span style={{ lineHeight: '9px' }}>Published</span>
              </div>
              : null
          }
        </FlexContainer>
        <div style={{ width: 0 }}></div>
        {item.editedAt ?
          <FlexContainer>
            <EditIcon style={{ fontSize: '9px' }} />
            <span style={{ marginLeft: '4px', lineHeight: '9px' }}>{getLocalDate(item.editedAt)}</span>
          </FlexContainer>
          : null
        }
      </FlexContainer>
    </ArticleItemStyled >
  )
};

export default ArticleItem;
