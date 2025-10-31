import Resource from '../../resource';
import Configuration from '../../configuration';
import Token from './Token';

export default class Opal extends Resource {
  token: Token;

  constructor(config: Configuration) {
    const _config = config.addPath('opal');
    super(_config);
    this.token = new Token(_config);
  }
};

export * from './types';
