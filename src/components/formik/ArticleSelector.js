import cn from 'classnames';
import { _ } from '~/utils';
import React from 'react';
import styled from "@emotion/styled";
import FormControl from '@mui/material/FormControl';
import { ArticleSelector } from "~/components/UI";
import { useField } from 'formik';

const ArticleSelectorStyled = styled('div')`

`;

const ArticleSelectorFieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta, { setValue }] = useField(name);
  const { value } = field;

  const configTextField = {
    ...field,
    ...otherProps
  };

  const hasError = meta && meta.touched && meta.error;

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  const handleArticleSelect = (articleId) => {
    setValue(articleId);
  };

  return (
    <ArticleSelectorStyled>
      <FormControl style={{ margin: 0, width: '100%' }} className={cn({ 'has-error': hasError })} sx={{ m: 1 }}>
        <ArticleSelector
          {...configTextField}
          articleId={value}
          onSelect={handleArticleSelect}
        />
      </FormControl>
      {hasError && (
        <p style={{
          backgroundColor: 'transparent',
          color: '#ff1744',
          margin: '4px 0 0 12px',
          fontSize: '12px'
        }}>{meta.error}</p>
      )}
    </ArticleSelectorStyled>
  )
}

export default ArticleSelectorFieldWrapper;
