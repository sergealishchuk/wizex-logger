import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import UserSettings from '~/components/pages/userSettings';

export default function AdminSettingsPage(props) {

  return (
    <div>
      <UserSettings {...props} />
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'admin_main',
        'currency',
        'profile_main',
        'user_settings',
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
