import { LatinLetter } from './latinLetter';

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  styleType: StyleType;
  color: string | null;
}

export enum StyleType {
  UNSTYLED = 'unstyled',
  UNDERLINED = 'underlined',
  COLORED = 'colored',
}

