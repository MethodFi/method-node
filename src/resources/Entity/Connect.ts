import Resource, { IResourceError } from "../../resource";
import Configuration from "../../configuration";

export const EntityConnectResponseStatuses = {
  completed: 'completed',
  pending: 'pending',
  failed: 'failed',
  in_progress: 'in_progress',
};

export type TEntityConnectResponseStatuses =
  |'completed'
  | 'pending'
  | 'failed'
  | 'in_progress';

export interface IEntityConnect {
  id: string;
  status: TEntityConnectResponseStatuses;
  accounts: string[] | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
}

export class EntityConnect extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('connect'));
  }

  /**
   * Retrieves the connection status of an entity
   * 
   * @param cxn_id id of the entity connection
   * @returns IEntityConnectResponse
   */

  async retrieve(cxn_id: string) {
    return super._getWithId<IEntityConnect>(cxn_id);
  }

  /**
   * Creates an entity connection
   * 
   * @returns IEntityConnectResponse
   */

  async create() {
    return super._create<IEntityConnect, {}>({});
  }
}