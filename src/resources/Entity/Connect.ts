import Resource, { IResourceError, TResourceStatus } from "../../resource";
import Configuration from "../../configuration";

export interface IEntityConnect {
  id: string;
  status: TResourceStatus;
  accounts: string[] | null;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class EntityConnect extends Resource {
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
};