import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { BlinkingDot } from "~/components/UI";
import { projectsService } from '~/http/services';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Link from "~/components/Link";
import { _, getLocalDate, getTimeBySec, getDiffWithcurrentStr, Observer } from "~/utils";
import { FlexContainer } from "~/components/StyledComponents";
import { Button } from "@mui/material";

let ticks = [];

const ProjectActions = (props) => {
  console.log('ProjectActions props:', props);
  const { project: projectInput, actions: actionsInput } = props.data;
  const [project, setProject] = useState(projectInput || {});
  const [actions, setActions] = useState(actionsInput || []);
  const [tick, setTick] = useState();
  const [tickCounter, setTickCounter] = useState(1);
  const [active, setActive] = useState(projectInput?.active);


  useEffect(() => {
    setProject(projectInput);
    setActive(projectInput?.active);
  }, [projectInput]);

  useEffect(() => {
    setActions(actionsInput);
    if (ticks.length > 0) {
      ticks.map(tick => clearInterval(tick));
      ticks = [];
    }
    const currentTick = setInterval(() => {
      setTickCounter(Math.random());
    }, 8000);
    setTickCounter(Math.random());

    ticks.push(currentTick);
  }, [actionsInput]);

  const getBuildInfoRequest = async () => {
    const projectInfoRequest = await projectsService.getProjectInfo({
      projectId: project.id,
    });
    if (projectInfoRequest.ok) {
      const { actions } = projectInfoRequest.data;
      setActions(actions);
    }
  };

  useEffect(() => {
    // const buildsStatatusesUpdated = Observer.addListener('onBuildsStatatusesUpdated', (params = {}, cb) => {
    //   getBuildInfoRequest();
    // });

    // return () => {
    //   if (ticks.length > 0) {
    //     ticks.map(tick => clearInterval(tick));
    //     ticks = [];
    //   }
    //   Observer.removeListener(buildsStatatusesUpdated)
    // }
  }, []);

  const handleChangeActive = async (event) => {
    console.log('active event', event.target.checked);
    const setActiveProjectRequest = await projectsService.setActiveProject({
      projectId: project.id,
      active: !active,
    });
    console.log('setActiveProjectRequest', setActiveProjectRequest)
    setActive(!active);
  };

  const handlePushEmptyCommit = async () => {
    console.log('push empty commit');
    const pushEmptyCommitRequest = await projectsService.pushEmptyCommit({
      projectId: project.id,
    });
    console.log('pushEmptyCommitRequest', pushEmptyCommitRequest);
  };

  return (
    <div>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} style={{ borderBottom: '1px #ededed solid' }}>
          <div style={{ fontSize: '12px', padding: '0 16px 16px 8px' }}>
            <div style={{ fontSize: '18px' }}>
              <FlexContainer jc="space-between">
                <span>{project.name}</span>
                <FormGroup style={{ marginRight: '4px' }}>
                  <FormControlLabel control={<Switch checked={active} onChange={handleChangeActive} size="small" />} label={<span className="unselect" style={{ marginLeft: '4px', fontSize: '14px' }}>Active</span>} />
                </FormGroup>
              </FlexContainer>
            </div>
            <div style={{ fontSize: '10px', lineHeight: '10px' }}><span>{project.description}</span></div>
            <div style={{ marginBottom: '24px' }}>
              <Link href={`/projects/edit/${project.id}`}>
                <Button style={{ padding: '0 12px', margin: 0, fontSize: '9px' }} variant="contained" size="small">Edit Project</Button>
              </Link>
            </div>
            <div><span><b>Resource Link:</b> </span><span><Link href={`${project.publicLink}`} style={{ color: '#0053f5', textDecoration: 'underline' }}>{project.publicLink}</Link></span></div>
          </div>
        </Grid>
        <Grid item xs={12} style={{ borderLeft: '1px #ededed solid' }}>
          <div style={{ padding: '16px 0 16px 0' }}>
            {
              actions.length > 0
                ? (
                  <div style={{ fontSize: '12px' }}>
                    <table width={'100%'}>
                      {
                        actions.map((row, index) => {
                          return (
                            <tr style={{ backgroundColor: index % 2 ? '#ededed' : 'white', padding: '2px 6px' }}>
                              <td><span style={{ fontSize: '11px', padding: '0 4px' }}>{row.id}</span></td>
                              <td>
                                <div style={{ padding: '0 8px', textAlign: 'center' }}>
                                  <BlinkingDot radius={5} color={row.status === 0 ? '#5e7ad3' : (row.status === 1 ? 'green' : (row.status === 2 ? 'red' : 'gray'))} blink={row.status === 0} />
                                </div>
                              </td>
                              <td width="100%">
                                <Link style={{ color: 'blue', textDecoration: 'underline' }} href={`/projects/build-detail/${row.id}`}>
                                  <span style={{ padding: '0 4px' }}>{row.commit?.message ? row.commit.message.replace(/\\n\\n/g, ': ') : ''}</span>
                                </Link>
                              </td>
                              <td><span style={{ whiteSpace: 'nowrap', padding: '0 8px', fontSize: '11px' }}>{getLocalDate(row.startedAt)}</span></td>
                              <td style={{ padding: '2px 12px', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: row.status === 0 ? 'normal' : 'bold' }}>{row.status === 0 ? (tickCounter ? getDiffWithcurrentStr(row.startedAt) : '') : getTimeBySec(row.longTimeSec)}</td>
                            </tr>
                          )
                        })
                      }
                    </table>
                  </div>
                )
                : (
                  <div>no actions</div>
                )
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
};

export default ProjectActions;
