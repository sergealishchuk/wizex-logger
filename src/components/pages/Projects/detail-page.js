import Link from "next/link";
import Tooltip from '@mui/material/Tooltip';
import { _, getLocalDate } from '~/utils';
import { useTranslation } from 'next-i18next';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { FlexContainer } from "~/components/StyledComponents";
//import { ProjectItemStyled } from './projectList/project-list.styled';
import { BlinkingDot } from "~/components/UI";
import { Button } from "@mui/material";

const DetailPage = (props = {}) => {
  const { item, last } = props;
  const { t } = useTranslation(['buttons', 'articles']);

  console.log('detail page prop s:', props);
  const { buildId, buildRecord, commit, commitHash, project, projectId, projectName } = props.data;
  console.log('wow:', { buildId, buildRecord, commit, commitHash, project, projectId, projectName });

  const message = commit?.message || '';
  let jiraLink = '';
  let jiraTask = '';
  if (message) {
    const jiraMatch = message.match(/(AS-\d+):/);

    if (jiraMatch) {
      jiraTask = jiraMatch[1];
      jiraLink = `https://alioks.atlassian.net/browse/${jiraTask}`
    }
  }

  return (
    <div>
      <div style={{ borderBottom: '1px #e2e2e2 solid' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}><div style={{ paddingLeft: '6px' }}>Project</div></td>
          </tr>
          <tr>
            <td style={{ minWidth: '100px' }}>Name:</td>
            <td style={{ width: '100%' }}>
              <span>{project.name}</span>
            </td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{project.description}</td>
          </tr>
          <tr>
            <td>Repository:</td>
            <td>
              <Link href={project.repoLink}>{project.repoLink}</Link>
            </td>
          </tr>

        </table>
      </div>
      <div style={{ borderBottom: '1px #e2e2e2 solid', marginTop: '32px' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}><div style={{ paddingLeft: '6px' }}>Commit</div></td>
          </tr>
          <tr>
            <td style={{ minWidth: '100px' }}>Id:</td>
            <td style={{ width: '100%' }}>{commit.id}</td>
          </tr>
          <tr>
            <td>Message:</td>
            <td>
              {commit.message.split(/\\n/g).map(str => {
                return <div>{str}</div>
              })}
            </td>
          </tr>
          <tr>
            <td>Author:</td>
            <td>{`${commit.author.name} <${commit.author.email}>`}</td>
          </tr>
          <tr>
            <td>Commit Url:</td>
            <td><Link href={commit.url}>{commit.url}</Link></td>
          </tr>
          {
            jiraLink && (
              <tr>
                <td>Jira Link:</td>
                <td><Link href={jiraLink}>{jiraTask}</Link></td>
              </tr>
            )
          }
          <tr>
            <td>Modified files:</td>
            <td>{commit.modified.join(', ')}</td>
          </tr>

        </table>
      </div>
      <div style={{ borderBottom: '1px #e2e2e2 solid', marginTop: '32px' }}>
        <table width="100%" style={{ fontSize: '12px' }}>
          <tr style={{ backgroundColor: '#ededed', padding: '4px 8', fontSize: '18px', fontWeight: 'bold' }}>
            <td colSpan={2}>
              <div style={{ paddingLeft: '6px' }}>
                <FlexContainer jc="flex-start">
                  <BlinkingDot radius={5} color={buildRecord.status === 0 ? '#5e7ad3' : (buildRecord.status === 1 ? 'green' : (buildRecord.status === 2 ? 'red' : 'gray'))} blink={buildRecord.status === 0} />
                  <span style={{ marginLeft: '12px' }}>Log</span>
                  {
                    buildRecord.status === 0 &&
                    <span>: In progress...</span>
                  }
                </FlexContainer>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {/* {buildRecord.status !== 0
                && <div dangerouslySetInnerHTML={{ __html: buildRecord.log }} />
              } */}
              <div>
                <pre>
                  {buildRecord.log}
                </pre>
              </div>
            </td>
          </tr>
        </table>


      </div>
    </div>
  )
};

export default DetailPage;
