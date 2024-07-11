import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ArticlesPanel from '~/components/pages/ShopAdmin/ArticlesPanel';

export default function ArticlesPanelPage(props) {
  return (
    <ArticlesPanel {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query, locale } = props;
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'admin_main',
        'admin_users',
        'articles',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
      data: {
        query,
      },
      pageParams: {
        withoutFooter: true,
        withScrollUpButton: true,
      },
    }
  }
};
