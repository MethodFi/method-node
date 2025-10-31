import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type {
  IOpalToken,
  IOpalTokenCreateOpts,
} from './types';

export default class OpalToken extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('token'));
  }

  /**
   * Creates token to be used with Opal
   * https://docs.methodfi.com/reference/opal/create_token
   *
   * @param opts IOpalTokenCreateOpts
   * @returns IOpal { token: string, valid_until: string, session_id: string };
   */

  async create(opts: IOpalTokenCreateOpts) {
    return super._create<IResponse<IOpalToken>, IOpalTokenCreateOpts>(opts);
  }
};
