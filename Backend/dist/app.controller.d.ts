import { AppService } from './app.service';
import { ExtendedListItem } from './types/general/stringList';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getListItems(): ExtendedListItem[];
    getListItem(name: string): ExtendedListItem | undefined;
    addItem(body: {
        name: string;
    }): ExtendedListItem;
}
