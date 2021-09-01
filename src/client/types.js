// @flow
import { Environments } from './enums';

export type TEnvironments = $Keys<typeof Environments>;

export type TMethodClientConfig = {
  env: TEnvironments,
  key: string,
};
