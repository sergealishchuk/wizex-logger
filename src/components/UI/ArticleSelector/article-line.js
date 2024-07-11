import { useState, useEffect } from "react";
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { Button } from "@mui/material"
import { ArticleLineStyled, ArticleErrorStyled } from "./article-selector.styled";
import { _ } from '~/utils';

export default (props) => {
  const { value = "", error, touched, label, onClick = _.noop } = props;
  const [focus, setFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const { t } = useTranslation(['articles', 'buttons']);

  const handleSelectCategory = () => {
    onClick();
  };

  useEffect(() => {
    const showError = touched && Boolean(error);
    setHasError(showError);
    if (error) {
      setErrorMessage(error);
    }
  }, [error, touched]);

  const handleFocus = () => {
    setFocus(true);
  };

  const hadnleBlur = () => {
    setFocus(false);
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      <ArticleLineStyled className={cn("unselect", { focus, error: hasError })} onClick={handleSelectCategory} tabIndex="-1" onFocus={handleFocus} onBlur={hadnleBlur}>
        {label && <label>{label}</label>}
        {
          value.length > 0
            ? <div style={{ zIndex: 9, padding: '3px 0', marginRight: '20px' }}>{value}</div>
            : <div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>{t('not_selected', { ns: 'articles' })}</div>
        }

        <Button>
          {
            t(value.length > 0 ? 'change' : 'select', { ns: 'buttons' })
          }
        </Button>
      </ArticleLineStyled>
      {
        hasError && (
          <ArticleErrorStyled>
            <span>{errorMessage}</span>
          </ArticleErrorStyled>
        )
      }
    </div>
  )
};
