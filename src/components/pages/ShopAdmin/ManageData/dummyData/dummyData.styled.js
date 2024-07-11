import styled from "@emotion/styled";
import { FlexContainer } from "~/components/StyledComponents";

export const BoxStyled = styled(FlexContainer)`
  font-size: 14px;
  border: 1px #d1d1d1 solid;
  margin: 10px;
  padding: 16px;
  border-radius: 7px;
  > * {
    margin: 2px 0 22px;
  }
  .box-label {
    background-color: white;
    padding: 1px 9px;
    font-size: 14px;
    margin-top: -28px;
  }
`;
