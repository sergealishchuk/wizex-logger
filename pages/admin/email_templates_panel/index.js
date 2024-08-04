import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EmailTemplates from '~/components/pages/ShopAdmin/EmailTemplates';

export default function EmailTemplatesPage(props) {
  return (
    <EmailTemplates {...props} />
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
        'common',
        'email_templates',
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
