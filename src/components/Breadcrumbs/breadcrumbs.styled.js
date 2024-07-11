import styled from '@emotion/styled';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export const BreadcrumbsStyled = styled(Breadcrumbs)`
  .MuiBreadcrumbs-ol {
    flex-wrap: nowrap;
    overflow-x: scroll;
    li:first-child {
      position: sticky;
      margin-left: 0px;
      left: 0;
      a {
        border-right: 1px #c9c9c9 solid;
      }
    }
  }
  &.uk {
    .MuiBreadcrumbs-ol {
      li:nth-child(2) {
        margin-left: 7px;
      }
    }
  }
  &.en {
    .MuiBreadcrumbs-ol {
      li:nth-child(2) {
        margin-left: 10px;
      }
    }
  }
`;