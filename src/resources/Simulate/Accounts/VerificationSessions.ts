import Resource from '../../../resource';
import Configuration, { IResponse } from '../../../configuration';

export interface IVerificationSessionAmounts {
  amounts: number[];
};

export class SimulateVerificationSessionInstance extends Resource {
  constructor(avf_id: string, config: Configuration) {
    super(config.addPath(avf_id));
  }

  async amounts() {
    return super._getWithSubPath<IResponse<IVerificationSessionAmounts>>('amounts');
  }
};

export interface SimulateVerificationSessions {
  (avf_id: string): SimulateVerificationSessionInstance;
};

export class SimulateVerificationSessions extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('verification_sessions'));
  }

  protected _call(avf_id: string): SimulateVerificationSessionInstance {
    return new SimulateVerificationSessionInstance(avf_id, this.config);
  }
};

export default SimulateVerificationSessions;
