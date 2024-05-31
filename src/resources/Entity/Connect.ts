import Resource, { IResourceError, TResourceStatus } from "../../resource";
import Configuration from "../../configuration";

export interface IEntityConnect {
  id: string;
  entity_id: string;
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
   * Retrieves a Connect record for an Entity.
   * 
   * @param cxn_id ID of the entity connection
   * @returns Returns a Connect object.
   */

  async retrieve(cxn_id: string) {
    return super._getWithId<IEntityConnect>(cxn_id);
  }

  /**
   * Creates a new Connect request to connect all liability accounts for the Entity.
   * 
   * @returns Returns a Connect object.
   */

  async create() {
    return super._create<IEntityConnect, {}>({});
  }
};
