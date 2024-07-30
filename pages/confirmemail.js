import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfirmEmail from '~/components/pages/confirmEmail';

export default function ConfirmedEmailPage(props) {
  return (
    <ConfirmEmail {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query, locale, req, res } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'locale',
        'confirm_email',
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
      },
    },
  };
};
