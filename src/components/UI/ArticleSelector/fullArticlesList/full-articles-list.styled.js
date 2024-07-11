import styled from "@emotion/styled";

export const FullArticlesListStyled = styled('div')`
  padding-top: 8px;
  padding-bottom: 32px;
  .selected {
    background-color: #dfdfdf;
  }
`;

export const ArticleItemStyled = styled('div')`
  padding: 6px 32px;
  border-radius: 5px;
  transition: all 200ms;
  &:hover {
    background-color: #f5f5f5;
  }
  .dates-change {
    font-size: 8px;
  }
`;
