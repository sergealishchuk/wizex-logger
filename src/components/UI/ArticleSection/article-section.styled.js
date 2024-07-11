import styled from '@emotion/styled';

export const ArticleSectionStyled = styled('div')`
  text-align: left;
  margin-bottom: 40px;
  padding-right: 16px;
  overflow: hidden;
  min-height: 80px;
  font-size: 13px;
  transition: height 300ms;
  height: 0;
  &.open {
    height: 100%;
    .read-more-less-block {
      bottom: 0;
    }
  }
  .read-more-less-block {
    cursor: pointer;
    text-decoration: underline;
    display: flex;
    padding-right: 36px;
    justify-content: flex-end;
    align-items: flex-end;
    text-align: center;
    height: 36px;
    background-color: gray;
    position: absolute;
    bottom: 36px;
    width: 100%;
    background: rgb(255,255,255);
    background: linear-gradient(0deg, rgba(255,255,255,1) 53%, rgba(255,255,255,0) 100%);
  }
`;
