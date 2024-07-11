import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoginPage from '~/components/pages/LogInPage';

export default function UserProfile(props) {

  return (
    <LoginPage {...props} />
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'locale',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
      pageParams: {
        withoutFooter: true,
      },
    },
  };
};
