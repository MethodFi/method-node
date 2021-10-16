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
    Configuration._validateConfiguration(opts);

    this.baseURL = `https://${opts.env}.methodfi.com`;
    this.apiKey = opts.apiKey;
  }

  public addPath(path: string): Configuration {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    clone.baseURL = `${clone.baseURL}/${path}`;

    return clone;
  }

  private static _validateConfiguration(opts: IConfigurationOpts): void {
    if (!Environments[opts.env]) throw new Error(`Invalid env: ${opts.env}`);
    if (!opts.apiKey) throw new Error(`Invalid apiKey: ${opts.apiKey}`);
  }
}
