import styled from "@emotion/styled";

export const BlockEntitiesStyled = styled('div')`
  .buttons-wrapper {
    display: flex;
    justify-content: flex-end;
    button {
      font-size: 8px;
      padding: 1px 6px;
      margin-left: 12px;
      svg {
        font-size: 17px !important;
      }
    }
  }
  .list-item {
    border: 1px #d0d0d0 solid;
    margin: 8px 0;
    border-radius: 5px;
  }
`;

export const ItemStyled = styled('div')`
  
`;

export const BottomDrawerWrapper = styled('div')`
  padding: 0 16px;
  color: #333;
`;

export const TopPanelStyled = styled('div')`
  background-color: #ececec;
  padding: 4px 32px;
  border-bottom: 1px #c5c5c5 solid;
  text-align: right;
  span.link {
    font-size: 11px;
    color: #072950;
    text-decoration: underline;
    cursor: pointer;
  }
`;