
import { useState, useEffect } from 'react';
import { FlexContainer, SmallButton } from '~/components/StyledComponents';
import Link from "~/components/Link";
import ProjectList from './projectList';
import User from '~/components/User';
import { ROLES } from '~/constants';

const Projects = (props) => {
  const { projects } = props.data;
  const [adminRole, setAdminRole] = useState(false);
  const [tariffIsValid, setTariffIsValid] = useState(false);

  useEffect(() => {
    if (User.isLog()) {
      const { roles, tariffValid } = User.read();
      console.log('User.read();', User.read());
      setTariffIsValid(tariffValid);
      if (roles.includes(ROLES.ADMIN)) {
        setAdminRole(true);
      }
    }

  }, []);

  return (
    <div>
      <FlexContainer jc="space-between" style={{flexWrap: 'wrap'}}>
        {tariffIsValid
          ? <div style={{ dispaly: 'flex', alignItems: 'center', marginLeft: '12px', fontSize: '12px', lineHeight: '15px', marginBottom: '6px'}}>Ви не можете добавляти нові проекти, так як для цього необхідно <Link style={{ textDecoration: 'underline', cursor: 'pointer', color: '#0048c2' }} href="/payments">оплатити тариф</Link><div></div></div>
          : <span></span>
        }
        <div style={{ textAlign: 'right', marginRight: '22px' }}>
          <Link href="/projects/new" disabled={true}>
            <SmallButton disabled={true} btn="blue">New Project</SmallButton>
          </Link>
        </div>
      </FlexContainer>
      <ProjectList projectList={projects} />
    </div >
  )
};

export default Projects;
