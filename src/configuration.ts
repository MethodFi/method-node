type TEnvironments =
  | 'production'
  | 'sandbox'
  | 'dev';

type EnvironmentsMapped = { [key in TEnvironments]: key };

export const Environments: EnvironmentsMapped = {
   production: 'production',
   sandbox: 'sandbox',
   dev: 'dev',
}

export interface IConfigurationOpts {
  apiKey: string,
  env: TEnvironments,
}

export default class Configuration {
  baseURL: string;
  apiKey: string;

  constructor(opts: IConfigurationOpts) {
    this.validateConfiguration(opts);

    this.baseURL = `https://${opts.env}.methodfi.com`;
    this.apiKey = opts.apiKey;
  }

  private validateConfiguration(opts: IConfigurationOpts): void {
    // TODO:
  }
}
