import styled from "@emotion/styled";
import { FlexContainer } from "~/components/StyledComponents"

export const ArticleLineStyled = styled(FlexContainer)`
  position: relative;
  width: 100%;
  color: #333;
  min-height: 44px;
  justify-content: space-between;
  border: 1px #c7c7c7 solid;
  border-radius: 4px;
  padding: 2px 16px;
  cursor: pointer;
  background-color: white;
  
  &:hover {
    border: 1px black solid;
  }
  
  &.focus {
    border: 2px #466dd9 solid;
    padding: 0px 15px;
  }

  &.error {
    border: 2px #ff1744 solid;
    color: #ff1744;
    label {
      color: #ff1744;
    }
  }

  label {
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    font-size: 12px;
    color: #888;
    padding: 0 4px;
    margin-top: -11px;
    margin-left: 9px;
  }
`;

export const ArticleErrorStyled = styled('div')`
  span {
    color: #ff1744;
    font-size: 12px;
    margin-left: 14px;
  }
`;
