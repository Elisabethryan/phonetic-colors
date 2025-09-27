import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ExtendedListItem } from './types/general/stringList';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): { message: string } {
    return { message: this.appService.getHealth() };
  }
}
