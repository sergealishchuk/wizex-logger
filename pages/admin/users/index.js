import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Users from '~/components/pages/ShopAdmin/Users';

export default function UsersPanel(props) {
  return (
    <Users {...props} />
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'admin_main',
        'admin_users',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
    }
  }
};
