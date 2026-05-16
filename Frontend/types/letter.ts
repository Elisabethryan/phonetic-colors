import { LatinLetter } from "./latinLetter";

export type StyleType = "unstyled" | "underlined" | "colored";

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  //style?: Style; Todo add this cooler type
  styleType: StyleType;
  color: string | null;
}

/* Todo this cool style is unused
export type Style =
  | { type: "unstyled" }
  | { type: "underlined" }
  | { type: "colored"; color: string };
*/
