import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DummyData from '~/components/pages/ShopAdmin/ManageData/dummyData';

export default function DummyDataPage(props) {

  return (
    <div>
      <DummyData {...props} />
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
