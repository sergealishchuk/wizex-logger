
import { Button } from '@mui/material';
import Link from "~/components/Link";
import ProjectList from './projectList';

const Projects = (props) => {
  const { projects } = props.data;

  return (
    <div>
      <div style={{ textAlign: 'right', marginRight: '16px' }}>
        <Link href="/projects/new">
          <Button style={{ padding: '0 12px', margin: 0, fontSize: '9px' }} variant="contained" size="small">New Project</Button>
        </Link>
      </div>
      <ProjectList projectList={projects} />
    </div>
  )
};

export default Projects;
