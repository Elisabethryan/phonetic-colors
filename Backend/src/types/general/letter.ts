export type StyleType = 'unstyled' | 'underlined' | 'colored';

export interface FormattedLetter {
  letter: string;
  sound?: string;
  styleType: StyleType;
  color: string | null;
}
