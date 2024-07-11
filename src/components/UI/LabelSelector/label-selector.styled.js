import styled from "@emotion/styled";

export const LabelSelectorStyled = styled('div')`
  color: #222;
  margin-bottom: 28px;
  .title {
    font-weight: bold;
    //border-bottom: 1px #d0d0d0 dotted;
    background-color: #fafafa;
    padding: 0 8px;
  }
  .leaf {
    font-weight: bold;
    display: inline-block;
    padding: 4px 8px;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    margin-right: 8px;
    margin-top: 6px;
    background-color: #ffe7c5;
    font-size: 14px;
  }
  svg {
    font-size: 14px;
    margin-right: 8px;
    color: #555;
  }
`;

export const LabelStyled = styled('div')`
  color: #262626;
  display: inline-block;
  border: 1px #c0c0c0 solid;
  border-radius: 5px;
  background-color: #f2f2f2;
  font-size: 14px;
  padding: 4px 8px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
  transition: all 100ms;
  /* &:hover:not(.disabled):not(.selected) {
    background-color: #e7e3e3;
    color: #ff7300;
  } */
  &.selected {
    border: 1px #939393 solid;
    background-color: #d0d4dc;
    color: #262626;
  }
  &.disabled {
    color: #c5c5c5;
    background-color: white;
    border-color: #b5b5b5;
    cursor: default;
    pointer-events: none;
    opacity: 0.3;
    color: #242424;
    &.selected {
      background-color: #bec5d0;
      
      
    }
  }
  .badge-count {
    font-size: 8px;
    color: green;
    position: absolute;
    top: 0;
    right: -5px;
    margin-top: -9px;
    background-color: #fbfffc;
    border-radius: 6px;
    border: 1px green solid;
    height: 11px;
    padding: 0px 4px;
    line-height: 10px;
  }
`;
