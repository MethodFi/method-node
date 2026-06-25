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

  async retrieve(pk_opal_tkn_id: string) {
    return super._getWithId<IResponse<IOpalToken>>(pk_opal_tkn_id);
  }

  async deactivate(pk_opal_tkn_id: string) {
    return super._delete<IResponse<IOpalToken>>(pk_opal_tkn_id);
  }
};
