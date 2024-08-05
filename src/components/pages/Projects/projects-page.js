import { useState, useEffect } from 'react';
import { FlexContainer, SmallButton } from '~/components/StyledComponents';
import Link from "~/components/Link";
import ProjectList from './projectList';
import { useTranslation } from 'next-i18next';
import User from '~/components/User';
import { ROLES } from '~/constants';

const Projects = (props) => {
  const { projects } = props.data;
  const [adminRole, setAdminRole] = useState(false);
  const [tariffIsValid, setTariffIsValid] = useState(false);

  const { t } = useTranslation(['projects', 'sidebar']);

  useEffect(() => {
    if (User.isLog()) {
      const { roles, tariffValid } = User.read();
      setTariffIsValid(tariffValid);
      if (roles.includes(ROLES.ADMIN)) {
        setAdminRole(true);
      }
    }
  }, []);

  return (
    <div>
      <FlexContainer jc="space-between" style={{ flexWrap: 'wrap' }}>
        {!tariffIsValid
          ? <div style={{ dispaly: 'flex', alignItems: 'center', marginLeft: '12px', fontSize: '12px', lineHeight: '15px', marginBottom: '6px' }}>{t('need_to_pay', {ns: 'projects'})} <Link style={{ textDecoration: 'underline', cursor: 'pointer', color: '#0048c2' }} href="/payments">{t('pay_tariff', {ns: 'projects'})}</Link><div></div></div>
          : <span></span>
        }
        <div style={{ textAlign: 'right', marginRight: '22px' }}>
          <Link href="/projects/new" disabled={!tariffIsValid}>
            <SmallButton disabled={!tariffIsValid} btn="blue">{t('add_new_project', { ns: 'projects' })}</SmallButton>
          </Link>
        </div>
      </FlexContainer>
      <ProjectList projectList={projects} />
    </div >
  )
};

export default Projects;
