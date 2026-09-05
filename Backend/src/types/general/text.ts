import { FormattedLetter } from './letter';

export interface Text {
  id: string;
  text: FormattedLetter[];
}

export interface DbText {
  id: string;
  text: string[];
}
