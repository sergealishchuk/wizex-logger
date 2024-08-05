import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProjectForm from '~/components/pages/Projects/projectForm';
import { ADD_MODE } from '~/constants';

export default function EditProjectPage(props) {
  return (
    <ProjectForm {...props} mode={ADD_MODE} />
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
