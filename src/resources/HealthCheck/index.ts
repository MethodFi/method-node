import Resource from '../../resource';
import Configuration from '../../configuration';


export default class HealthCheck extends Resource<void> {
  constructor(config: Configuration) {
    super(config.addPath('ping'));
  }

  async get() {
    return super._getRaw<any>();
  }
}
