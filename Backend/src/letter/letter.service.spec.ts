import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../db/database.service';
import { LetterService } from './letter.service';

describe('LetterService', () => {
  let service: LetterService;
  const databaseService = { query: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LetterService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    service = module.get<LetterService>(LetterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns formatted letters in alphabetical order', async () => {
    const letters = [{ id: 'a', letter: 'A', styleType: 'colored' }];
    databaseService.query.mockResolvedValue(letters);

    await expect(service.findAll()).resolves.toEqual(letters);
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT ps.id, ps.spelling AS letter, p."styleType", p.color ' +
        'FROM "PhonemeSpelling" ps ' +
        'JOIN "Phoneme" p ON p.id = ps."phonemeId" ' +
        'ORDER BY ps.spelling ASC, ps.id ASC',
    );
  });
});
