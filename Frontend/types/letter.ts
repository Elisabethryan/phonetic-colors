import { LatinLetter } from "./latinLetter";

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  //style?: Style; Todo add this cooler type
  styleType: string;
  color: string;
}

/* Todo this cool style is unused
export type Style =
  | { type: "unstyled" }
  | { type: "underlined" }
  | { type: "colored"; color: string };
*/
