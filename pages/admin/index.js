import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainAdminPanel from '~/components/pages/ShopAdmin/MainAdminPanel';

export default function AdminPanel(props) {
  return (
    <MainAdminPanel {...props} />
  );
};


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['buttons', 'sidebar', 'admin_main'])),
    }
  }
};
