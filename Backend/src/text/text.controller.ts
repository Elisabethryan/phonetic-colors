import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TextService } from './text.service';
import { ExtendedListItem } from '../types/general/stringList';
import { Text } from 'src/types/general/text';

@Controller()
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('text/:id')
  getListItem(@Param('id') id: string): Text | undefined {
    const extendedItem = this.textService.getText(id);
    return extendedItem;
  }
}
