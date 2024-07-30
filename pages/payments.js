import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { createSSRErrorResponse, _, createHttpRequestOptions } from '~/utils';
import { userService } from '~/http/services';
import PaymentsPanel from '~/components/pages/Payments';
import { CatchingPokemonSharp } from '@mui/icons-material';

export default function BlocksPanelPage(props) {
  return (
    <PaymentsPanel {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query, locale } = props;

  let data = {};
  try {
    const productDataQuery = await userService.getPayments({}, createHttpRequestOptions(props));
    const { data: dataInput } = productDataQuery;
    data = dataInput;
  } catch (e) { 
    console.log(e)
    data = {
      error: true,
    }
  }


  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'admin_main',
        'common',
        'payments',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
      data: {
        query,
        ...data,
      },
      pageParams: {
        withoutFooter: true,
        withScrollUpButton: true,
      },
    }
  }
};
