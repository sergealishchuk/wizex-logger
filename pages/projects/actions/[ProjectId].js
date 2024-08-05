import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProjectActions from '~/components/pages/ProjectActions';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function UserProfile(props) {
  return (
    <ProjectActions {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query: { ProjectId, f = '' }, locale } = props;
  const projectInfoRequest = await projectsService.getProjectInfo({ projectId: ProjectId, f }, createHttpRequestOptions(props));

  let data = {
    projectId: ProjectId,
  };

  let projectName = 'my_project_name';

  if (projectInfoRequest.ok) {
    const { project, actions } = projectInfoRequest.data;
    data['project'] = project;
    data['actions'] = actions;
    projectName = project.name;
    data['query'] = { f };
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
        'projects',
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
