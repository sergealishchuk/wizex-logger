import { useEffect } from "react";
import Link from "next/link";
import { _, getLocalDate, copyToClipboard } from '~/utils';
import { useTranslation } from 'next-i18next';
import { FlexContainer } from "~/components/StyledComponents";
import { SmallButton } from "~/components/StyledComponents";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);

const DetailPage = (props = {}) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'projects', 'articles']);

  const router = useRouter();

  const { actionId, actionRecord, body = {}, headers = {}, project, projectId, projectName } = props.data;

  useEffect(() => {
    document.querySelectorAll('pre.json').forEach((el) => {
      console.log('wow el:', el);
      hljs.highlightElement(el);
    });
  }, []);

  const handleFilterBySession = () => {
    const sessionId = headers['x-wizex-session-id'];
    router.push(`/projects/actions/${projectId}/?f=${sessionId}`);
  };

  const handleBack = () => {
    router.back();
  };
  console.log('!!! body:', body);
  return (
    <div>
      <div style={{ borderBottom: '1px #e2e2e2 solid' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}><div style={{ paddingLeft: '6px' }}>{t('project', {ns: 'project'})}</div></td>
          </tr>
          <tr>
            <td style={{ minWidth: '100px', whiteSpace: 'nowrap', fontWeight: '600' }}>{t('name', {ns: 'projects'})}:</td>
            <td style={{ width: '100%' }}>
              <span>{project.name}</span>
            </td>
          </tr>
          <tr>
            <td style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>{t('description', {ns: 'projects'})}:</td>
            <td>{project.description}</td>
          </tr>
          <tr>
            <td style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>{t('public_link', {ns: 'projects'})}:</td>
            <td>
              <Link href={project.publicLink}>{project.publicLink}</Link>
            </td>
          </tr>
        </table>
      </div>
      <FlexContainer jc="space-between" style={{ marginTop: '12px' }}>
        <SmallButton startIcon={<ArrowBackIcon />} btn="gray" onClick={handleBack}>{t('back', {ns: 'projects'})}</SmallButton>
        <SmallButton btn="green" onClick={handleFilterBySession}>{t('filter_this_session', {ns: 'projects'})}</SmallButton>
      </FlexContainer>

      <div style={{ borderBottom: '1px #e2e2e2 solid', marginTop: '12px' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}>
              <div style={{ paddingLeft: '6px' }}>
                <FlexContainer jc="flex-start">
                  <span>{t('content', {ns: 'projects'})}</span>
                </FlexContainer>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div>
                <table width="100%" style={{ fontSize: '12px', overflowX: 'auto' }}>
                  {Object.keys(body).map(parameterName => {
                    return (
                      <tr>
                        <td style={{ verticalAlign: 'top', minWidth: '100px', whiteSpace: 'nowrap', fontWeight: '600' }}>
                          <span>{parameterName}:</span>
                        </td>
                        <td style={{ width: '100%' }}>
                          <span>
                            {
                              typeof (body[parameterName]) === 'object'
                                ? <div>
                                  <div>
                                    <span>Object Type: </span>
                                    <SmallButton onClick={() => copyToClipboard(JSON.stringify(body[parameterName], null, 2))} style={{ fontSize: '11px' }}>Copy To Clipboard</SmallButton>
                                  </div>
                                  <pre style={{ marginTop: 0 }} className="json">{JSON.stringify(body[parameterName], null, 2)}
                                  </pre>
                                </div>
                                : body[parameterName]
                            }
                          </span>

                        </td>
                      </tr>)
                  })}
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style={{ borderBottom: '1px #e2e2e2 solid', marginTop: '32px' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}>
              <div style={{ paddingLeft: '6px' }}>
                <FlexContainer jc="flex-start">
                  <span>Headers</span>
                </FlexContainer>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div>
                <table width="100%" style={{ fontSize: '12px' }}>
                  {Object.keys(headers).map(parameterName => {
                    return (
                      <tr>
                        <td style={{ minWidth: '100px', whiteSpace: 'nowrap', fontWeight: '600' }}>{parameterName}:</td>
                        <td style={{ width: '100%' }}>
                          <span>{headers[parameterName]}</span>
                        </td>
                      </tr>)
                  })}
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  )
};

export default DetailPage;
