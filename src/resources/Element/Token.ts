import Resource from '../../resource';
import Configuration, { IResponse } from '../../configuration';
import type {
  IElementToken,
  IElementTokenCreateOpts,
  IElementResults,
} from './types';

export default class ElementToken extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('token'));
  }
  
  /**
   * Creates token to be used with Element
   * 
   * @param opts IElementTokenCreateOpts
   * @returns IElement { element_token: string };
   */

  async create(opts: IElementTokenCreateOpts) {
    return super._create<IResponse<IElementToken>, IElementTokenCreateOpts>(opts);
  }

  /**
   * Retrieve the results of an Element session.
   * 
   * @param pk_elem_id ID of the Element token
   * @returns Returns an ElementResults object.
   */
  
  async results(pk_elem_id: string) {
    return super._getWithSubPath<IResponse<IElementResults>>(`${pk_elem_id}/results`);
  }
};
