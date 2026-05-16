import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TextService } from './text.service';
import { Text } from 'src/types/general/text';
import { DbTestService } from '../db/db-test-service';
import { CreateTextDto } from './dto/create-text.dto';

@Controller()
export class TextController {
  constructor(
    private readonly textService: TextService,
    private readonly dbTestService: DbTestService,
  ) {}

  @Get('text/latest')
  async getLatestText(): Promise<Text | undefined> {
    return this.textService.getLatestText();
  }

  @Get('text/:id')
  async getText(@Param('id') id: string): Promise<Text | undefined> {
    return this.textService.getText(id);
  }

  @Post('text')
  async createText(@Body() createTextDto: CreateTextDto): Promise<Text> {
    return this.textService.createText(createTextDto);
  }

  @Get('testdb')
  async testDb() {
    return this.dbTestService.checkConnection();
  }
}
