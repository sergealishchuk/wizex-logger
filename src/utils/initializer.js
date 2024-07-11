import { _ } from '~/utils';

class Initializer{
  constructor(entities = [], runner = _.noop) {
    this.entities = entities;
    this.runner = runner;
    this.container = []
  }

  checker() {
    if (_.difference(this.container, this.entities).length === 0) {
      this.runner();
    }
  }

  add(entity) {
    if (!_.find(this.container, item => item === entity)) {
      this.container.push(entity);
      this.checker();
    }
  }
}

export default Initializer;
