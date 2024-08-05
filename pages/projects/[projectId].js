import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Projects } from '~/components/pages/Projects';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function UserProfile(props) {
  return (
    <Projects {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query, locale } = props;

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
      data: {
        query,
      },
      pageParams: {
        withoutFooter: true,
      },
    },
  };
};
