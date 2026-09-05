import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TextService } from './text.service';
import { ExtendedListItem } from '../types/general/stringList';
import { Text } from 'src/types/general/text';
import { DbTestService } from '../db/db-test-service';

@Controller()
export class TextController {
  constructor(
    private readonly textService: TextService,
    private readonly dbTestService: DbTestService,
  ) {}

  @Get('text/:id')
  async getListItem(@Param('id') id: string): Promise<Text | undefined> {
    const extendedItem = await this.textService.getText(id);
    return extendedItem;
  }

  @Get('testdb')
  async testDb() {
    return this.dbTestService.checkConnection();
  }
}
