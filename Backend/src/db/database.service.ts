import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  async getClient() {
    const environment = this.configService.get<string>('ENVIRONMENT');
    return environment === 'Development'
      ? new Client({
          host: this.configService.get<string>('DB_HOST', 'localhost'),
          port: Number(this.configService.get<number>('DB_PORT', 5432)),
          user: this.configService.get<string>('POSTGRES_USER'),
          password: this.configService.get<string>('POSTGRES_PASSWORD'),
          database: this.configService.get<string>('POSTGRES_DB'),
        })
      : new Client({
          connectionString: this.configService.get<string>('DATABASE_URL'),
          ssl: { rejectUnauthorized: false }, // Railway requires SSL
        });
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const client = await this.getClient();
    try {
      await client.connect();
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      await client.end();
    }
  }
}
