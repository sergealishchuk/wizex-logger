import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
import { FlexContainer } from "~/components/StyledComponents";
import { ProjectItemStyled } from './project-list.styled';
import { SmallButton } from "~/components/StyledComponents";
import { useRouter } from "next/router";

const ProjectItem = (props) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  const router = useRouter();

  const handleEditProject = (projectId) => {
    router.push(`/projects/edit/${projectId}`);
  };

  return (
    <ProjectItemStyled style={{ borderBottom: !last ? '1px #e2e2e2 solid' : 'none' }}>
      <FlexContainer jc="space-between">
        <Link style={{ paddingRight: '10px' }} href={`/projects/actions/${item.id}`}>
          {item.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href={`${item.publicLink}`}>
            <Tooltip title={t('open_link', { ns: 'projects' })}>
              <span>
                {item.publicLink}
              </span>
            </Tooltip>
          </Link>
          <div style={{ marginLeft: '16px' }}>
            <SmallButton btn="blue" onClick={() => handleEditProject(item.id)}>{item.mine ? 'Edit' : 'Detail'}</SmallButton>
          </div>
          <div style={{ minWidth: '70px', fontSize: '11px', textAlign: 'center', padding: '0 4px' }}>
            {
              item.active
                ? <span style={{ color: 'green'}}>active</span>
                : <span style={{ color: 'gray' }}>stopped</span>
            }
          </div>
        </div>
      </FlexContainer>
    </ProjectItemStyled >
  )
};

export default ProjectItem;
