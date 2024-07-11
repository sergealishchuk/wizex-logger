import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DetailPage } from '~/components/pages/Projects';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions } from '~/utils';

export default function BuildDetailPage(props = {}) {
  //console.log('build detail props:', props);
  //const { buildId, buildRecord, commit, commitHash, project, projectId, projectName } = props.data;
  return (
    // <ProjectBuilds {...props} />
    <DetailPage {...props} />
  );
};

export async function getServerSideProps(props) {
  const { query: { buildId }, locale } = props;

  const getBuildDetail = await projectsService.getBuildDetail({ buildId }, createHttpRequestOptions(props));
  

 
  const { data } = getBuildDetail;

  const { projectId, projectName, commitHash } = data;


  
  // let projectName = 'my_project_name';
  // let commitHash = 'ad651fd1';
  // let projectId = 2;

  // if (projectInfoRequest.ok) {
  //   const { project, builds } = projectInfoRequest.data;
  //   data['project'] = project;
  //   data['builds'] = builds;
  //   projectName = project.name;
  // }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'buttons',
        'sidebar',
        'errors',
        'successes',
        'infos',
        'warnings',
        'locale',
      ])),
      data,
      pageParams: {
        withoutFooter: true,
        bcProps: {
          projectName,
          commitHash,
          projectId,
        },
      },
    },
  };
};
