import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Projects } from '~/components/pages/Projects';
import ProjectForm from '~/components/pages/Projects/projectForm';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';
import { ADD_MODE, EDIT_MODE } from '~/constants';

export default function EditProjectPage(props) {
  return (
    <ProjectForm {...props} mode={EDIT_MODE} />
  );
};

export async function getServerSideProps(props) {
  const { query: { projectId }, locale } = props;

  const projectInfoRequest = await projectsService.getProjectInfo({ projectId, builds: false }, createHttpRequestOptions(props));

  let data = {};

  if (projectInfoRequest.ok) {
    const { project } = projectInfoRequest.data;
    data['project'] = project;
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
      },
    },
  };
};
