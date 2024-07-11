import styled from "@emotion/styled";

export const ShadowStyled = styled('div')`
  background: transparent;
  &.open {
    top: 0;
    left: 0;
    position: absolute;
    background: #83858526;
    transition: all 300ms;
    bottom: 0;
    right: 0;
    z-index: 1101;
    position: fixed;
    z-index: 1101;
  }
`;

export const SearchStyled = styled('div')`
  top: 0;
  position: fixed;
  width: 100%;
  text-align: center;
  z-index: 1099;
  transition: all 300ms;
  transition-property: top, opacity;
  opacity: 0;

  &.open {
    z-index: 1099;
    top: 104px;
  }

  &.opened {
    z-index: 1110;
    opacity: 1;
  }

  .search-container {
    text-align: left;
    display: inline-block; 
    width: 80%;
    max-width: 500px;

    .search-box {
      display: flex;
      align-items: center;
      padding: 3px 16px 3px 12px;
      color: red;
      border: 1px #c3c3c3 solid;
      border-radius: 22px;
      width: 100%;
      color: #333;
      background-color: white;
      box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
      
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
      .search-button {
        font-size: 12px;
        padding: 2px 27px;
        border-radius: 13px;
        background-color: #efefef;
        color: #333;
        margin-right: -7px;
        &[disabled] {
          background-color: #f1f0f0;
          color: #777;
        }
        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
    .search-result-container {
      width: 100%;
      display: inline-block;
      margin-top: -2px;
      background-color: transparent;
      .search-result {
        font-size: 16px;
        border: 1px #eee solid;
        text-align: left;
        margin: 2px 16px;
        padding: 2px 16px;
        padding-bottom: 8px;
        background-color: white;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);

        .result-item {
          cursor: default;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100%;
          overflow: hidden;
          color: #444;
          font-size: 16px;
          padding: 1px 4px;
          &.active {
            background-color: #eee;
          }
          em {
            color: #122c45;
          }
        }
        
      }
    }
  }
`;
