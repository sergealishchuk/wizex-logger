import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Projects } from '~/components/pages/Projects';
import ProjectForm from '~/components/pages/Projects/projectForm';
import { projectsService } from '~/http/services';
import { createHttpRequestOptions, createSSRErrorResponse } from '~/utils';
import { ADD_MODE, EDIT_MODE } from '~/constants';

export default function EditProjectPage(props) {
  return (
    <ProjectForm {...props} mode={EDIT_MODE} />
  );
};

export async function getServerSideProps(props) {
  const { query: { projectId }, locale } = props;

  const translations = await serverSideTranslations(locale, [
    'buttons',
    'sidebar',
    'errors',
    'successes',
    'infos',
    'warnings',
    'locale',
    'projects',
  ]);

  let result;

  let projectInfoRequest;
  try {
    projectInfoRequest = await projectsService.getProjectInfo({ projectId, builds: false }, createHttpRequestOptions(props));
    console.log('projectInfoRequest', projectInfoRequest);
  } catch (e) {
    console.log('error:::::::::', e);
    const handleError = createSSRErrorResponse(e);
    console.log('handleError:', handleError);
    return {
     // notFound: true,
      ...handleError,

      props: {
        
        ...handleError.props,
        ...translations,
      }};
  }
  console.log('projectId:', projectId);
  console.log('projectInfoRequest', projectInfoRequest, JSON.stringify(projectInfoRequest));

  let data = {};

  

  if (projectInfoRequest.ok) {
    const { project } = projectInfoRequest.data;
    data['project'] = project;
    result = {
      props: {
        ...translations,
        data,
        pageParams: {
          withoutFooter: true,
        },
      }
    }
  } else {

    const withErrors = createSSRErrorResponse(projectInfoRequest);
    console.log('withErrors -> ', JSON.stringify(withErrors));
    result = {
      //...withErrors,

      props: {
        ...withErrors.props,
        ...translations,
      }
    }

  }

  //console.log('result::::', JSON.stringify(result));
  //result = {props: {}};
  return result;
};
