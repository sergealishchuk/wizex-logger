
import { useState, useEffect } from 'react';
import { SmallButton } from '~/components/StyledComponents';
import Link from "~/components/Link";
import ProjectList from './projectList';
import User from '~/components/User';
import { ROLES } from '~/constants';

const Projects = (props) => {
  const { projects } = props.data;
  const [adminRole, setAdminRole] = useState(false);

  useEffect(() => {
    if (User.isLog()) {
      const { roles } = User.read();
      if (roles.includes(ROLES.ADMIN)) {
        setAdminRole(true);
      }
    }

  }, []);

  return (
    <div>
      {adminRole
        ?
        <div style={{ textAlign: 'right', marginRight: '22px' }}>
          <Link href="/projects/new">
            <SmallButton btn="blue">New Project</SmallButton>
          </Link>
        </div>
        : null
      }
      <ProjectList projectList={projects} />
    </div>
  )
};

export default Projects;
