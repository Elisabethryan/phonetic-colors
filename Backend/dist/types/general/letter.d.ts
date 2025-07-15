import { LatinLetter } from './latinLetter';
export interface FormattedLetter {
    id: string;
    letter: LatinLetter;
    style: Style;
}
export declare enum Style {
    ACTIVE = "unstyled",
    INACTIVE = "underlined",
    PENDING = "colored"
}
