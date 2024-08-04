import styled from "@emotion/styled";
import Drawer from '@mui/material/Drawer';

export const BottomDrawerStyled = styled(Drawer)`
  .MuiDrawer-paper {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    min-width: 370px;
    max-height: 90%;
    height: 100%;
    overflow-y: hidden;
    .filter-title {
      padding: 5px 20px;
      text-align: right;
      border-bottom: 1px #cdcdcd solid;
    }
    .info-line {
      padding: 16px 30px;
      background-color: #e9e9e9;
      height: 21px;
      border-bottom: 1px #d1d1d1 solid;
      margin-bottom: 4px;
      font-size: 13px;
      &.scroll-shadow {
        box-shadow: 10px 13px 8px -9px rgba(17,17,17,.2);
        transition: box-shadow 100ms;
      }
    }
  }
  .not-found {
    padding: 2px 32px;
    font-size: 14px;
    color: #444;
  }
`;
