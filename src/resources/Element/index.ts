import Resource from '../../resource';
import Configuration from '../../configuration';
import Token from './Token';

export default class Element extends Resource {
  token: Token;

  constructor(config: Configuration) {
    const _config = config.addPath('element');
    super(_config);
    this.token = new Token(_config);
  }
};
