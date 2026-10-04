export type StyleType = 'unstyled' | 'underlined' | 'colored';

export interface FormattedLetter {
  letter: string;
  styleType: StyleType;
  color: string | null;
}
