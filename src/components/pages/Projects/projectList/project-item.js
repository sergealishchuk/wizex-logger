import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { FlexContainer } from "~/components/StyledComponents";
import { ProjectItemStyled } from './project-list.styled';

const ProjectItem = (props) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  return (
    <ProjectItemStyled style={{ borderBottom: !last ? '1px #e2e2e2 solid' : 'none' }}>
      <FlexContainer jc="space-between">
        <Link style={{ paddingRight: '10px' }} href={`/projects/actions/${item.id}`}>
          {item.name}
        </Link>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Link href={`${item.publicLink}`}>
            <Tooltip title={t('open_link', { ns: 'projects' })}>
              <span>
                {item.publicLink}
              </span>
            </Tooltip>
          </Link>
          <div style={{ minWidth: '40px', fontSize: '11px', textAlign: 'right', padding: '0 4px' }}>
            {
              item.active
                ? <span style={{color: 'green'}}>active</span>
                : <span style={{color: 'gray'}}>stop</span>
            }
          </div>
        </div>
      </FlexContainer>
    </ProjectItemStyled >
  )
};

export default ProjectItem;
