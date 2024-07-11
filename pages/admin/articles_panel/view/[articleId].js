import { createSSRErrorResponse, _ } from '~/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ArticleView } from '~/components/pages/ShopAdmin/ArticlesPanel'; 

export default function ArticleAdminView(props) {
  return (
    <div>
      <ArticleView {...props} />
    </div>
  )
};

export async function getServerSideProps(props) {
  const { query, locale, req, res } = props;
  const { articleId } = query;

  let result;
  try {
    result = {
      props: {
        ...(await serverSideTranslations(locale, [
          'sidebar',
          'buttons',
          'articles',
          'errors',
          'successes',
          'infos',
          'warnings',
        ])),
        data: {
          ...query,
        },
        pageParams: {
          withScrollUpButton: true,
          bcProps: {
            shiftLeft: true,
          },
        },
      }
    };
  } catch (e) {
    const translations = await serverSideTranslations(locale, ['buttons', 'sidebar', 'article']);
    const withErrors = createSSRErrorResponse(e);

    result = {
      ...withErrors,
      ...{
        props: {
          ...withErrors.props,
          ...translations,
        }
      },
    }
  };

  return result;
};
