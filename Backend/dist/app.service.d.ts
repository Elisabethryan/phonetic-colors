import { ExtendedListItem } from './types/general/stringList';
export declare class AppService {
    list: string[];
    extendedList: {
        id: string;
        name: string;
        desc: string;
    }[];
    getListItems(): ExtendedListItem[];
    getItemInfo(name: string): ExtendedListItem | undefined;
    addItem(name: string): ExtendedListItem;
}
