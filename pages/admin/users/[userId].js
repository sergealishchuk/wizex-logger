import UserDetail from '~/components/pages/ShopAdmin/Users/user_detail';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function UserDetailPage(props) {
  return (
    <div>
      <UserDetail {...props} />
    </div>
  )
};

export async function getServerSideProps({ query, locale }) {
  const { userId } = query;
  return {
    props: {
      userId,
      ...(await serverSideTranslations(locale, [
        'sidebar',
        'admin_users',
        'buttons',
        'errors',
        'successes',
        'infos',
        'warnings',
      ])),
      pageParams: {
        withoutFooter: true,
        bcProps: {
          userId,
        }
      },
    },
  }
};
