import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FlexContainer } from '~/components/StyledComponents';

export default function Error(props) {
  return (
    <FlexContainer>
      <h1>Error Happen!</h1>
    </FlexContainer>
  );
};

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['buttons', 'sidebar'])),
      pageParams: {
        withoutFooter: true,
      },
    },
  };
};