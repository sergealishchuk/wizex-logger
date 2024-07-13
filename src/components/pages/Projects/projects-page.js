
import { Button } from '@mui/material';
import { SmallButton } from '~/components/StyledComponents';
import Link from "~/components/Link";
import ProjectList from './projectList';

const Projects = (props) => {
  const { projects } = props.data;

  return (
    <div>
      <div style={{ textAlign: 'right', marginRight: '22px' }}>
        <Link href="/projects/new">
          <SmallButton btn="blue">New Project</SmallButton>
        </Link>
      </div>
      <ProjectList projectList={projects} />
    </div>
  )
};

export default Projects;
