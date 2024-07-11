import Badge from '@mui/material/Badge';
import styled from '@emotion/styled';

export default ({ value, color }) => {

  const StyledBadge = styled(Badge)`
  margin-right: 20px;
  .MuiBadge-badge {
    background-color: ${color || 'green'};
  }
`;
  return (
    <StyledBadge badgeContent={value} color="secondary" />
  )
};
