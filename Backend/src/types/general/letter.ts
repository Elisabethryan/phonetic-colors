import { LatinLetter } from './latinLetter';

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  style: Style;
}

export enum StyleType {
  UNSTYLED = 'unstyled',
  UNDERLINED = 'underlined',
  COLORED = 'colored',
}

export type Style =
  | { type: 'unstyled' }
  | { type: 'underlined' }
  | { type: 'colored'; color: string };
