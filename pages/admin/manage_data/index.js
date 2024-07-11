import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ManageData from '~/components/pages/ShopAdmin/ManageData';

export default function ManageDataPage(props) {

  return (
    <div>
      <ManageData {...props} />
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
      ])),
      pageParams: {
        withoutFooter: true,
      },
    },
  };
};
