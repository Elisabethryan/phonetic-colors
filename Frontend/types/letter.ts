import { LatinLetter } from "./latinLetter";

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  style: string;
}

export type Style =
  | { type: "unstyled" }
  | { type: "underlined" }
  | { type: "colored"; color: string };
