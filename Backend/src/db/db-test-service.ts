import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DbTestService {
  constructor(private configService: ConfigService) {}

  async checkConnection() {
    console.log(this.configService.get<string>('POSTGRES_PASSWORD'));
    const client = new Client({
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: Number(this.configService.get<number>('DB_PORT', 5432)),
      user: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB'),
    });

    try {
      await client.connect();
      const result = await client.query('SELECT NOW()');
      return { message: 'Connected ✅', serverTime: result.rows[0] };
    } catch (err) {
      console.error(err);
      return { message: 'Connection failed ❌', error: err.message };
    } finally {
      await client.end();
    }
  }
}
