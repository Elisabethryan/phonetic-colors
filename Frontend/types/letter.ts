import { LatinLetter } from "./latinLetter";

export interface FormattedLetter {
  id: string;
  letter: LatinLetter;
  styleType: "unstyled" | "underlined" | "colored";
  color: string | null;
}
