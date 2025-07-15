import { TextService } from './text.service';
import { Text } from 'src/types/general/text';
export declare class TextController {
    private readonly textService;
    constructor(textService: TextService);
    getListItem(id: string): Text | undefined;
}
