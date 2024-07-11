import { useState, useEffect } from 'react';
import { projectsService } from '~/http/services';
import ProjectList from '../projectList';
import { Observer } from '~/utils';

let ticks = [];

const ActiveProjects = (props) => {
  const { projectList: inputProjectList } = props;

  const [projectList, setProjectList] = useState(inputProjectList);

  useEffect(() => {
    setProjectList(inputProjectList);
  }, [inputProjectList]);

  const getActiveProjectsRequest = async () => {
    const activeProjectsRequest = await projectsService.getActiveProjects();
    if (activeProjectsRequest.ok) {
      const { projects } = activeProjectsRequest.data;
      console.log('wow project:', projects);
      setProjectList(projects);
    }
  };

  useEffect(() => {
    const buildsStatatusesUpdated = Observer.addListener('onBuildsStatatusesUpdated', (params = {}, cb) => {
      getActiveProjectsRequest();
    });

    return () => {
      if (ticks.length > 0) {
        ticks.map(tick => clearInterval(tick));
        ticks = [];
      }
      Observer.removeListener(buildsStatatusesUpdated)
    }
  }, []);
  return (
    <div>
      <ProjectList projectList={projectList} />
    </div>
  )
};

export default ActiveProjects;
