import { useState } from "react";
import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
//import BorderColorIcon from '@mui/icons-material/BorderColor';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { FlexContainer } from "~/components/StyledComponents";
import { ArticleItemStyled } from './full-articles-list.styled';

const ArticleItem = (props) => {
  const { item, last, onShowArticle, onSelectArticle } = props;

  const { t } = useTranslation(['buttons', 'articles']);

  const handleShowArticle = (item) => {
    onShowArticle(item);
  };

  return (
    <ArticleItemStyled style={{ borderBottom: !last ? '1px #e2e2e2 solid' : 'none' }}>
      <FlexContainer jc="space-between">
        <div className="unselect" style={{ textDecoration: 'underline', flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', paddingRight: '10px' }} onClick={() => onSelectArticle(item.id)}>
          {item.title} <span style={{ marginLeft: '4px', fontSize: '9px', lineHeight: '9px' }}>({getLocalDate(item.createdAt)})</span>
        </div>
        <Tooltip title={t(item.bodyEdited !== null ? 'continue_edit' : 'edit', { ns: 'articles' })}>
          <span>
            <IconButton onClick={() => handleShowArticle(item)}>
              <VisibilityIcon style={{ fontSize: '17px', color: '#333', border: item.bodyEdited !== null ? '1px brown solid' : 'none', borderRadius: '10px' }} />
            </IconButton>
          </span>
        </Tooltip>
      </FlexContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          _.map(item.tagsStr, tag => (
            <span className="unselect" style={{ whiteSpace: 'nowrap', fontSize: '10px', margin: '2px 0px', backgroundColor: '#e1e1e1', padding: '0px 8px', borderRadius: '7px' }}>{tag}</span>
          ))
        }
      </div>
    </ArticleItemStyled>
  )
};

export default ArticleItem;
