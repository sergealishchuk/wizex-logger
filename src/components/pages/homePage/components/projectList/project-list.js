import ProjectItem from "./project-item";
import { ProjectListStyled } from "./project-list.styled";
import { _ } from '~/utils';


const ProjectList = (props) => {
  const { projectList = []} = props;
  console.log('projectList', projectList);

  return (
    <ProjectListStyled>
      {
        _.map(projectList, (project, index) => {
          return (
            <div key={project.id}>
              <ProjectItem item={project} last={index === projectList.length - 1} />
            </div>
          )
        })
      }
      {
        projectList.length === 0 && (
          <div style={{ fontSize: '14px', padding: '16px' }}>Not Found</div>
        )
      }
    </ProjectListStyled>
  )
};

export default ProjectList;
