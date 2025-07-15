import { LatinLetter } from './latinLetter';

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  style: Style;
}

export enum Style {
  ACTIVE = 'unstyled',
  INACTIVE = 'underlined',
  PENDING = 'colored',
}
/*
export type Style =
  | { type: 'unstyled' }
  | { type: 'underlined' }
  | { type: 'colored' };
//varför får jag inte används mina coola typer*/
