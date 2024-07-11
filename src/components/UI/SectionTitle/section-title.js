import Box from '@mui/material/Box';
import { SectionTitleStyled } from "./section-title.styled";

export default (props) => {
  const { icon, text } = props;
  return (
    <SectionTitleStyled>
      <Box className="section-container">
        {icon}
        <span>{text}</span>
      </Box>
    </SectionTitleStyled>
  )
};
