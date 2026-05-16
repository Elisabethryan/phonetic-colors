import { DbFormattedLetter } from './letter';

export interface Text {
  id: string;
  text: DbFormattedLetter[];
}

export interface DbText {
  id: number;
  content: string[];
}
