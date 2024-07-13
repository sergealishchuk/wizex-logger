import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { projectsService } from '~/http/services';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Link from "~/components/Link";
import { _, confirmDialog, getLocalDate, getTimeBySec, getDiffWithcurrentStr, Observer } from "~/utils";
import { FlexContainer } from "~/components/StyledComponents";
import { SmallButton } from "~/components/StyledComponents";
import { useRouter } from "next/router";
import { DIALOG_ACTIONS } from '~/constants';


let ticks = [];

const ProjectActions = (props) => {
  const { project: projectInput, actions: actionsInput, query: { f: filterInput } } = props.data;
  const [project, setProject] = useState(projectInput || {});
  const [actions, setActions] = useState(actionsInput || []);
  const [filter, setFilter] = useState(filterInput);
  const [tick, setTick] = useState();
  const [tickCounter, setTickCounter] = useState(1);
  const [active, setActive] = useState(projectInput?.active);

  const router = useRouter();

  useEffect(() => {
    setFilter(filterInput);
  }, [filterInput]);

  useEffect(() => {
    setProject(projectInput);
    setActive(projectInput?.active);
  }, [projectInput]);

  // useEffect(() => {
  //   setActions(actionsInput);
  //   if (ticks.length > 0) {
  //     ticks.map(tick => clearInterval(tick));
  //     ticks = [];
  //   }
  //   const currentTick = setInterval(() => {
  //     setTickCounter(Math.random());
  //   }, 8000);
  //   setTickCounter(Math.random());

  //   ticks.push(currentTick);
  // }, [actionsInput]);

  const getProjectInfoRequest = async () => {
    const projectInfoRequest = await projectsService.getProjectInfo({
      projectId: project.id,
      f: filter,
    });
    if (projectInfoRequest.ok) {
      const { actions } = projectInfoRequest.data;
      setActions(actions);
    }
  };

  useEffect(() => {
    const projectStatatusesUpdated = Observer.addListener('onProjectStatatusesUpdated', (params = {}, cb) => {
      getProjectInfoRequest();
    });

    return () => {
      Observer.removeListener(projectStatatusesUpdated)
    }
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


  const handleClearFilter = () => {
    router.push(`/projects/actions/${project.id}`);
  };

  const handleRemoveLogs = async () => {
    const confirm = await confirmDialog({
      text: `Do you want to delete all logs for the "${project.name}" project?`,
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      console.log('handleRemoveLogs');
      const setActiveProjectRequest = await projectsService.removeAllLogs({
        projectId: project.id,
      });
      router.push(`/projects/actions/${project.id}`);
    }
  };

  return (
    <div>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} style={{ borderBottom: '1px #ededed solid' }}>
          <div style={{ fontSize: '12px', padding: '0 16px 16px 8px' }}>
            <div style={{ fontSize: '18px' }}>
              <FlexContainer jc="space-between">
                <span style={{ marginLeft: '8px' }}>{project.name}</span>
                <FormGroup style={{ marginRight: '4px' }}>
                  <FormControlLabel control={<Switch checked={active} onChange={handleChangeActive} size="small" />} label={<span className="unselect" style={{ marginLeft: '4px', fontSize: '14px' }}>Active</span>} />
                </FormGroup>
              </FlexContainer>
            </div>
            <div style={{ marginLeft: '8px', fontSize: '10px', lineHeight: '10px' }}><span>{project.description}</span></div>
            <div style={{ marginBottom: '16px', marginTop: '16px' }}>
              <FlexContainer jc="space-between">
                <div>
                  <Link href={`/projects/edit/${project.id}`}>
                    <SmallButton btn="blue">Edit Project</SmallButton>
                  </Link>
                  {
                    actions.length > 0
                      ? <SmallButton style={{ marginRight: '16px' }} btn="red" onClick={handleRemoveLogs}>Delete Logs</SmallButton>
                      : <span></span>
                  }
                </div>
                {
                  filter
                    ? <SmallButton style={{ marginRight: '16px' }} btn="red" onClick={handleClearFilter}>Clear Filter</SmallButton>
                    : <span></span>
                }
              </FlexContainer>
            </div>
            <div><span style={{ marginLeft: '6px' }}><b>Resource Link:</b> </span><span><Link href={`${project.publicLink}`} style={{ color: '#0053f5', textDecoration: 'underline' }}>{project.publicLink}</Link></span></div>
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
                                  <span style={{ whiteSpace: 'nowrap' }}>[ {row.level} ]</span>
                                </div>
                              </td>
                              <td width="100%">
                                <Link style={{ color: 'blue', textDecoration: 'underline' }} href={`/projects/action-detail/${row.id}`}>
                                  <span style={{ padding: '0 4px' }}>{row.message}</span>
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
