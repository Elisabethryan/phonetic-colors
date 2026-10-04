import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../db/database.service';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

describe('LetterController', () => {
  let controller: LetterController;
  const databaseService = { query: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LetterController],
      providers: [
        LetterService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    controller = module.get<LetterController>(LetterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
