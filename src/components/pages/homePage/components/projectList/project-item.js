import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'next-i18next';
import { BlinkingDot } from "~/components/UI";
import { FlexContainer } from "~/components/StyledComponents";
import { ProjectItemStyled } from './project-list.styled';

const ProjectItem = (props) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  return (
    <ProjectItemStyled style={{ borderBottom: !last ? '1px #e2e2e2 solid' : 'none' }}>
      <FlexContainer jc="space-between">
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{ padding: '0 8px', textAlign: 'center' }}>
            <BlinkingDot radius={5} color={item.status === 0 ? '#5e7ad3' : (item.status === 1 ? 'green' : (item.status === 2 ? 'red' : '#d3cdcd'))} blink={item.status === 0} />
          </div>
          <Link style={{ paddingRight: '10px' }} href={`/projects/actions/${item.id}`}>
            {item.name}
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href={`${item.publicLink}`}>
            <Tooltip title={t('open_link', { ns: 'projects' })}>
              <span>
                {item.publicLink}
              </span>
            </Tooltip>
          </Link>
        </div>
      </FlexContainer>
    </ProjectItemStyled >
  )
};

export default ProjectItem;
