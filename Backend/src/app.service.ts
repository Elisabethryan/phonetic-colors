import { Injectable } from '@nestjs/common';
import { ExtendedListItem } from './types/general/stringList';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  getHealth(): string {
    return 'Backend is healthy';
  }
}
