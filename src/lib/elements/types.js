// @flow
import { ElementTypes } from './enums';

export type TElementTypes = $Keys<typeof ElementTypes>;

export type TElementCreateLink = {
  mch_id?: string,
  mask?: string,
};

export type TElementCreateTokenOptions = {
  entity_id: string,
  type: TElementTypes,
  team_name?: string,
  link?: ?TElementCreateLink,
};

export type TElementCreateTokenResponse = {
  element_token: string,
};
