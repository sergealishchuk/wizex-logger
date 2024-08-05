import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DetailPage } from '~/components/pages/Projects';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function BuildDetailPage(props = {}) {
  return (
    <DetailPage {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query: { actionId }, locale } = props;

  const getActionDetail = await projectsService.getActionDetail({ actionId }, createHttpRequestOptions(props));

  const { data } = getActionDetail;

  const { projectId, projectName } = data;

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
          projectName,
          commitHash: actionId,
          projectId,
        },
      },
    },
  };
};
