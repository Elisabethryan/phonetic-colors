import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ExtendedListItem } from './types/general/stringList';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('list-items')
  getListItems(): ExtendedListItem[] {
    const list = this.appService.getListItems();
    return list;
  }

  @Get('list-item-info/:name')
  getListItem(@Param('name') name: string): ExtendedListItem | undefined {
    const extendedItem = this.appService.getItemInfo(name);
    return extendedItem;
  }

  @Post('add-item')
  addItem(@Body() body: { name: string }): ExtendedListItem {
    const newItem = this.appService.addItem(body.name);
    return newItem;
  }
}
