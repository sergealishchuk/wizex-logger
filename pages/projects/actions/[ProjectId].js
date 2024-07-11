import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProjectActions from '~/components/pages/ProjectActions';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function UserProfile(props) {
  //console.log('builds props:', props);
  return (
    <ProjectActions {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query: { ProjectId }, locale } = props;

  const projectInfoRequest = await projectsService.getProjectInfo({ projectId: ProjectId }, createHttpRequestOptions(props));
  
  let data = {
    projectId: ProjectId,
  };
  
  let projectName = 'my_project_name';

  if (projectInfoRequest.ok) {
    const { project, actions } = projectInfoRequest.data;
    data['project'] = project;
    data['actions'] = actions;
    projectName = project.name;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'errors',
        'successes',
        'infos',
        'warnings',
        'locale',
      ])),
      data,
      pageParams: {
        withoutFooter: true,
        bcProps: {
          name: projectName,
        },
      },
    },
  };
};
