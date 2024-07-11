import { ActiveProjects } from "./components";

const HomePage = (props = {}) => {
  const { projects = [] } = props.data;

  return (
    <div>
      <ActiveProjects projectList={projects} />
    </div>
  )
};

export default HomePage;
