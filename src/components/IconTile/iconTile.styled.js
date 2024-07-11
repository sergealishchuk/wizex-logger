import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';

export const IconTileStyled = styled('div')`
  .MuiPaper-root {
    border: 1px #e1e1e1 solid;
    >div {
      border-radius: 92px;
      margin: 16px;
    }
    background-color: #fff;
    &:hover {
      background-color: #e5e6e8;
    }
  }
  .lock-icon {
    position: absolute;
    top: 0;
    color: #707000;
    font-size: 14px;
    margin: 10px;
  }
`;

export const Item = styled(Paper)`
  background-color: #fff;
  padding: 6px;
  text-align: center;
  color: #333;
  font-size: 16px;
  transition: background-color 200ms ease;
  svg {
    width: 100%;
    height: 100%;
    padding: 24px;
    color: #7d8195;
    opacity: 0.8;
  }
  .item-label {
    margin: 0 !important;
    padding-bottom: 8px;
  }
`;
