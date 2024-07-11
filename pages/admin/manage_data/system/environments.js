import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Environments } from '~/components/pages/ShopAdmin/ManageData/system';

export default function SystemPage(props) {

  return (
    <div>
      <Environments {...props} />
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
