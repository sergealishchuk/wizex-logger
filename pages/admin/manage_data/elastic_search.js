import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ElasticSearch from '~/components/pages/ShopAdmin/ManageData/elasticSearch';

export default function ElasticSearchPage(props) {

  return (
    <div>
      <ElasticSearch {...props} />
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
