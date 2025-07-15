import { Injectable } from '@nestjs/common';
import { ExtendedListItem } from './types/general/stringList';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  list = ['item1', 'item2', 'item3'];

  extendedList = [
    { id: '0', name: 'item1', desc: 'BIPP' },
    { id: '1', name: 'item2', desc: 'BOPP' },
    { id: '2', name: 'item3', desc: 'BLAPP' },
  ];

  getListItems(): ExtendedListItem[] {
    return this.extendedList;
  }

  getItemInfo(name: string): ExtendedListItem | undefined {
    const item = this.extendedList.find((item) => item.name === name);
    return item;
  }

  addItem(name: string): ExtendedListItem {
    const newItem: ExtendedListItem = {
      id: uuidv4(),
      name: name,
      desc: 'Sample description',
    };
    this.extendedList.push(newItem);
    return newItem;
  }
}
