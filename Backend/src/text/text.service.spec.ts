import { DatabaseService } from '../db/database.service';
import { TextService } from './text.service';

describe('TextService', () => {
  const databaseService = { query: jest.fn() };
  const textService = new TextService(
    databaseService as unknown as DatabaseService,
  );

  beforeEach(() => {
    databaseService.query.mockReset();
  });

  it('renders annotated spelling groups with their phoneme styles', async () => {
    databaseService.query
      .mockResolvedValueOnce([
        { transcription: 'sj=ɧ ä=ɛː l=l _ !=unknown plain' },
      ])
      .mockResolvedValueOnce([
        { symbol: 'ɧ', styleType: 'colored', color: '#4338ca' },
        { symbol: 'ɛː', styleType: 'colored', color: '#635b26' },
        { symbol: 'l', styleType: 'colored', color: '#15803d' },
      ]);

    const text = await textService.getText('1');

    expect(text?.text).toEqual([
      { letter: 'sj', styleType: 'colored', color: '#4338ca' },
      { letter: 'ä', styleType: 'colored', color: '#635b26' },
      { letter: 'l', styleType: 'colored', color: '#15803d' },
      { letter: ' ', styleType: 'unstyled', color: null },
      { letter: '!', styleType: 'unstyled', color: null },
      { letter: 'plain', styleType: 'unstyled', color: null },
    ]);
    expect(databaseService.query).toHaveBeenLastCalledWith(
      expect.stringContaining('WHERE p.symbol = ANY($1::text[])'),
      [['ɧ', 'ɛː', 'l', 'unknown']],
    );
  });
});
