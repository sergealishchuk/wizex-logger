import Link from "next/link";
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
import { FlexContainer } from "~/components/StyledComponents";
import { SmallButton } from "~/components/StyledComponents";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetailPage = (props = {}) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  const router = useRouter();

  const { actionId, actionRecord, body = {}, headers = {}, project, projectId, projectName } = props.data;

  const handleFilterBySession = () => {
    const sessionId = headers['x-wizex-session-id'];
    router.push(`/projects/actions/${projectId}/?f=${sessionId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div style={{ borderBottom: '1px #e2e2e2 solid' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}><div style={{ paddingLeft: '6px' }}>Project</div></td>
          </tr>
          <tr>
            <td style={{ minWidth: '100px', whiteSpace: 'nowrap', fontWeight: '600' }}>Name:</td>
            <td style={{ width: '100%' }}>
              <span>{project.name}</span>
            </td>
          </tr>
          <tr>
            <td style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>Description:</td>
            <td>{project.description}</td>
          </tr>
          <tr>
            <td style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>Public Link:</td>
            <td>
              <Link href={project.publicLink}>{project.publicLink}</Link>
            </td>
          </tr>
        </table>
      </div>
      <FlexContainer jc="space-between" style={{ marginTop: '12px' }}>
        <SmallButton startIcon={<ArrowBackIcon />} btn="gray" onClick={handleBack}>Back</SmallButton>
        <SmallButton btn="green" onClick={handleFilterBySession}>Filter by this session</SmallButton>
      </FlexContainer>

      <div style={{ borderBottom: '1px #e2e2e2 solid', marginTop: '12px' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}>
              <div style={{ paddingLeft: '6px' }}>
                <FlexContainer jc="flex-start">
                  <span>Content</span>
                </FlexContainer>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div>
                <table width="100%" style={{ fontSize: '12px' }}>
                  {Object.keys(body).map(parameterName => {
                    return (
                      <tr>
                        <td style={{ minWidth: '100px', whiteSpace: 'nowrap', fontWeight: '600' }}>{parameterName}:</td>
                        <td style={{ width: '100%' }}>
                          <span>{body[parameterName]}</span>
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
