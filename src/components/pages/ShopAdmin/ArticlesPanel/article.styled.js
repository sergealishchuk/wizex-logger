import styled from "@emotion/styled";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { FlexContainer } from "~/components/StyledComponents";

export const ArticleFormStyled = styled('div')`
  width: 100%;
`;

export const ArticleViewStyled = styled('div')`
  width: 100%;
`;

export const StyledStatus = styled.div`
  color: #e38c8c;
  text-align: right;
  margin-right: 12px;
`;

export const IconAddStyled = styled(AddCircleOutlineIcon)`
  margin-left: 8px;
  width: 26px;
  height: 26px;
  border: 1px gray solid;
  border-radius: 12px;
  color: gray;
`;

export const IconEditStyled = styled(BorderColorIcon)`
  margin-left: 8px;
  width: 26px;
  height: 26px;
  border: 1px gray solid;
  border-radius: 12px;
  color: gray;
`;

export const StatusEditBlock = styled(FlexContainer)`
  padding-left: 16px;
  font-size: 12px;
`;

export const ButtonSectionStyled = styled('div')`
  margin-top: 12px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px #eee solid;
	padding-bottom: 10px;
  button {
    padding: 0 7px;
  }
`;
