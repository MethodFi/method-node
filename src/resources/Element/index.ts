import Resource from '../../resource';
import Configuration from '../../configuration';
import Token from './Token';

export default class Element extends Resource {
  token: Token;

  constructor(config: Configuration) {
    super(config.addPath('elements'));
    this.token = new Token(config);
  }
};
