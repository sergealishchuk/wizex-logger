import styled from "@emotion/styled";

export const LabelSelectorStyled = styled('div')`
  color: #222;
  margin-bottom: 16px;
  .title {
    font-weight: bold;
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

export const CheckBoxItemStyled = styled('div')`
  padding: 2px 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  &:hover {
    color: #c18629;
    background-color: #f5f5f5;
  }
  svg {
    font-size: 17px;
    color: #c18629;
  }
  &.selected {
    font-weight: bold;
    font-size: 13px;
  }
  &.disabled {
    cursor: default;
    color: #999;
    svg {
      color: #999;
    }
    &:hover {
      background-color: transparent;
    }
  }
`;

export const LabelStyled = styled('div')`
  color: #262626;
  display: inline-block;
  border: 1px #e5e5e5 solid;
  border-radius: 5px;
  background-color: #f2f2f2;
  font-size: 14px;
  padding: 4px 8px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
  transition: all 100ms;
  &:hover:not(.disabled):not(.selected) {
    background-color: #e7e3e3;
    color: #ff7300;
  }
  &.selected {
    border: 1px #f5f5f1 solid;
    background-color: #bec5d0;
    color: #262626;
  }
  &.disabled {
    color: #777;
    cursor: default;
    pointer-events: none;
  }
`;
