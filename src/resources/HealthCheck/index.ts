import Resource from '../../resource';
import Configuration,{ IResponse }  from '../../configuration';


export interface IPingResponse {
  success: boolean;
  data: null;
  message: 'pong';
};

export default class HealthCheck extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('ping'));
  }

  /**
   * Check that the service is up and running
   * 
   * @returns IPingResponse
   */

  async retrieve() {
    return super._getRaw<IResponse<IPingResponse>>();
  }
};
