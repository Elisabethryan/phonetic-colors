import { StyleType } from 'src/types/general/letter';
import { LatinLetter } from 'src/types/general/latinLetter';

export interface CreateFormattedLetterDto {
  letter: LatinLetter;
  styleType: StyleType;
  color?: string;
}

export interface CreateTextDto {
  formattedLetters: CreateFormattedLetterDto[];
}
