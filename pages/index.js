import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HomePage from '~/components/pages/homePage';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function UserProfile(props) {

  return (
    <HomePage {...props} />
  );
};

export async function getServerSideProps(props) {
  const { locale } = props;
  const projectsRequest = await projectsService.getActiveProjects(createHttpRequestOptions(props));
  let data = {};
  if (projectsRequest.ok) {
    const { projects } = projectsRequest.data;
    data['projects'] = projects;
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
        withoutBreadcrumbs: true,
      },
    },
  };
};

