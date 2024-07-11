import { createSSRErrorResponse, _ } from '~/utils';
import { ADD_MODE } from '~/constants';
import guiConfig from "~/gui-config";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ArticleForm } from '~/components/pages/ShopAdmin/ArticlesPanel';

const { imagesUrl } = guiConfig;

export default function ArticleNewAdminView(props) {
  return (
    <div>
      <ArticleForm {...props} mode={ADD_MODE} />
    </div>
  )
};

export async function getServerSideProps(props) {
  const { query, locale, req, res } = props;
  //const { articleId } = query;

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
          //articleId,
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
