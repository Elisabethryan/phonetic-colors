import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../db/database.service';
import { DbTestService } from '../db/db-test-service';
import { TextController } from './text.controller';
import { TextService } from './text.service';

describe('TextController', () => {
  let textController: TextController;
  const databaseService = { query: jest.fn() };
  const dbTestService = { checkConnection: jest.fn() };

  beforeEach(async () => {
    const text: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
      providers: [
        TextService,
        { provide: DatabaseService, useValue: databaseService },
        { provide: DbTestService, useValue: dbTestService },
      ],
    }).compile();

    textController = text.get<TextController>(TextController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(textController.getHello()).toBe('Hello World!');
    });
  });
});
