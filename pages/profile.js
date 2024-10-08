import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Profile from '~/components/pages/Profile';

export default function UserProfile(props) {

	return (
		<Profile {...props} />
	);
};

export async function getServerSideProps(props) {
  const { locale, query = {} } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'profile_main',
        'profile_personal_data',
        'profile_contacts',
        'profile_address',
        'profile_change_login',
        'profile_change_password',
        'profile_preferences',
        'profile_remove_account',
        'currency',
        'locale',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
      pageParams: {
        withoutFooter: true,
      },
      data: {
        query,
      }
    },
  };
};
