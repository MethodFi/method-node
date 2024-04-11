import Resource from "../../resource";
import Configuration from "../../configuration";
import type { TCreditReportBureaus } from "./types";

export interface IEntityManualAuthOpts {
  format: string,
  bureau: TCreditReportBureaus,
  raw_report: {},
}

export interface IEntityManualAuthResponse {
  authenticated: boolean,
  accounts: string[],
}

export default class EntityManualAuthSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('manual_auth_session'));
  }

  async create(opts: IEntityManualAuthOpts) {
    return super._create<IEntityManualAuthOpts, IEntityManualAuthOpts>(opts);
  }

  async update(opts: IEntityManualAuthOpts) {
    return super._update<IEntityManualAuthResponse, IEntityManualAuthOpts>(opts);
  }
};