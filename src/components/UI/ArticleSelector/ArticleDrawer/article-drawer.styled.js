import styled from "@emotion/styled";
import Drawer from '@mui/material/Drawer';

export const ArticleDrawerStyled = styled(Drawer)`
  .MuiDrawer-paper {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    min-width: 370px;
    max-height: 90%;
    height: 100%;
    overflow: hidden;
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

export const SearchLineStyled = styled('div')`
  width: 100%;
  
  .search-container {
    text-align: left;
    display: inline-block; 
    width: 100%;
    //padding: 0 26px;
    margin: 16px 0;
    position: relative;
    &.focused {
      z-index: 999999;
    }
    .search-box {
      overflow: hidden;
      display: flex;
      align-items: center;
      color: red;
      border: 1px #c3c3c3 solid;
      border-radius: 6px;
      width: 100%;
      color: #333;
      background-color: white;
      .MuiFormControl-root {
        width: 100%;
        
        .MuiInputBase-root {
          width: 100%;

          fieldset {
            border-color: #f7f7f7;
          }

          input {
            padding: 0;
            padding-left: 6px;
            color: #333;
          }
        }
        
        .MuiOutlinedInput-root {
          border-color: #f7f7f7;
          
          &:hover fieldset {
            border-color: #f7f7f7;
          }
          
          &.Mui-focused fieldset {
            border-color: #f7f7f7;
          }
        }
      }
    }
  }
`;

export const ArticleViewer = styled('div')`
  visibility: hidden;
  background-color: white;
  opacity: 0.6;
  top: 0;
  left: 0;
  right: 0;
  left: 0;
  position: absolute;
  height: 100%;
  top: 1200px;
  transition: all 150ms ease;
  opacity: 0;
  z-index: 2;
  padding: 4px 20px;
  &.show {
    transition: all 100ms ease;
    visibility: visible;
    top: 48px;
    height: calc(100% - 48px);
    opacity: 1;
    overflow-y: auto;
  }
`;

