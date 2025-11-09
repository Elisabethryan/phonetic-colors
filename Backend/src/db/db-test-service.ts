import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Injectable()
export class DbTestService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  async checkConnection() {
    const environment = this.configService.get<string>('ENVIRONMENT');
    try {
      console.log('Connecting to database in environment: ', environment);
      const result = await this.databaseService.query(
        'SELECT * FROM "FormattedLetter"',
      );
      console.log('result:', result);
      return { message: 'Connected ✅', serverTime: result[0] };
    } catch (err) {
      console.error(err);
      return { message: 'Connection failed ❌', error: err.message };
    }
  }
}
