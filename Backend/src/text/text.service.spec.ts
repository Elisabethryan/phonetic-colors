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

  it('lists available texts in ID order', async () => {
    const texts = [
      { id: 1, title: 'Solen skiner över sjön.' },
      { id: 2, title: 'Katten sitter på stolen.' },
    ];
    databaseService.query.mockResolvedValueOnce(texts);

    await expect(textService.getTextList()).resolves.toEqual(texts);
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT id, title FROM "Text" ORDER BY id ASC',
    );
  });

  it('renders annotated spelling groups with their phoneme styles', async () => {
    databaseService.query
      .mockResolvedValueOnce([
        {
          transcription:
            'sj=ɧ sk=ɧ a=a a=ɑː g=ɡ k=k ä=ɛː l=l _ !=unknown plain',
        },
      ])
      .mockResolvedValueOnce([
        { symbol: 'ɧ', styleType: 'colored', color: '#139a49' },
        { symbol: 'a', styleType: 'colored', color: '#d11a69' },
        { symbol: 'ɑː', styleType: 'colored', color: '#317f10' },
        { symbol: 'ɡ', styleType: 'colored', color: '#657f10' },
        { symbol: 'k', styleType: 'colored', color: '#a67707' },
        { symbol: 'ɛː', styleType: 'colored', color: '#f5147d' },
        { symbol: 'l', styleType: 'colored', color: '#e10951' },
      ]);

    const text = await textService.getText('1');

    expect(text?.text).toEqual([
      { letter: 'sj', styleType: 'colored', color: '#00a650' },
      { letter: 'sk', styleType: 'colored', color: '#00a650' },
      { letter: 'a', styleType: 'colored', color: '#e65100' },
      { letter: 'a', styleType: 'colored', color: '#4527a0' },
      { letter: 'g', styleType: 'colored', color: '#555555' },
      { letter: 'k', styleType: 'colored', color: '#555555' },
      { letter: 'ä', styleType: 'colored', color: '#4e342e' },
      { letter: 'l', styleType: 'colored', color: '#555555' },
      { letter: ' ', styleType: 'unstyled', color: null },
      { letter: '!', styleType: 'unstyled', color: null },
      { letter: 'plain', styleType: 'unstyled', color: null },
    ]);
    expect(databaseService.query).toHaveBeenLastCalledWith(
      expect.stringContaining('WHERE p.symbol = ANY($1::text[])'),
      [['ɧ', 'a', 'ɑː', 'ɡ', 'k', 'ɛː', 'l', 'unknown']],
    );
  });
});
