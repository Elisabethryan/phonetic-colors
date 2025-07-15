import { Text } from 'src/types/general/text';
import { LatinLetter } from 'src/types/general/latinLetter';
import { Style } from 'src/types/general/letter';
export declare class TextService {
    formattedA: {
        id: string;
        letter: LatinLetter;
        style: Style;
    };
    formattedB: {
        id: string;
        letter: LatinLetter;
        style: Style;
    };
    text: Text;
    texts: Text[];
    getText(textId: string): Text | undefined;
}
