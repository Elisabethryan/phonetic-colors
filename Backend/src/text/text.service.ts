import { Injectable } from '@nestjs/common';
import { Text } from 'src/types/general/text';
import { FormattedLetter, StyleType } from 'src/types/general/letter';
import { DatabaseService } from '../db/database.service';

interface PhonemeRow {
  symbol: string;
  spelling: string;
  styleType: StyleType;
  color: string | null;
}

// Token used in a transcription to represent a literal space between words.
const SPACE_TOKEN = '_';

@Injectable()
export class TextService {
  constructor(private databaseService: DatabaseService) {}

  async createText(
    title: string,
    transcription: string,
  ): Promise<{ id: number }> {
    const rows = await this.databaseService.query<{ id: number }>(
      'INSERT INTO "Text" (title, transcription) VALUES ($1, $2) RETURNING id',
      [title, transcription],
    );
    return rows[0];
  }

  async getText(textId: string): Promise<Text | undefined> {
    const id = Number(textId);
    if (!Number.isInteger(id)) {
      return undefined;
    }

    const textRows = await this.databaseService.query<{
      transcription: string;
    }>('SELECT transcription FROM "Text" WHERE id = $1', [id]);
    const text = textRows[0];
    if (!text) {
      return undefined;
    }

    return {
      id: textId,
      text: await this.renderTranscription(text.transcription),
    };
  }

  private async renderTranscription(
    transcription: string,
  ): Promise<FormattedLetter[]> {
    const tokens = transcription.split(/\s+/).filter(Boolean);
    const symbols = [...new Set(tokens)].filter(
      (token) => token !== SPACE_TOKEN,
    );

    const phonemes = symbols.length
      ? await this.databaseService.query<PhonemeRow>(
          'SELECT p.symbol, ps.spelling, p."styleType", p.color ' +
            'FROM "Phoneme" p ' +
            'JOIN "PhonemeSpelling" ps ON ps."phonemeId" = p.id ' +
            'WHERE p.symbol = ANY($1::text[])',
          [symbols],
        )
      : [];
    const phonemeBySymbol = new Map(
      phonemes.map((phoneme) => [phoneme.symbol, phoneme]),
    );

    return tokens.map((token) => {
      if (token === SPACE_TOKEN) {
        return { letter: ' ', styleType: 'unstyled', color: null };
      }

      const phoneme = phonemeBySymbol.get(token);
      if (!phoneme) {
        return { letter: token, styleType: 'unstyled', color: null };
      }

      return {
        letter: phoneme.spelling,
        styleType: phoneme.styleType,
        color: phoneme.color,
      };
    });
  }
}
