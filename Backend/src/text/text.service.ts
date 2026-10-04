import { Injectable } from '@nestjs/common';
import { Text } from 'src/types/general/text';
import { FormattedLetter, StyleType } from 'src/types/general/letter';
import { DatabaseService } from '../db/database.service';

interface PhonemeRow {
  symbol: string;
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
    const annotatedTokens = tokens.flatMap((token) => {
      const separator = token.lastIndexOf('=');
      return separator > 0 && separator < token.length - 1
        ? [
            {
              spelling: token.slice(0, separator),
              symbol: token.slice(separator + 1),
            },
          ]
        : [];
    });
    const symbols = [...new Set(annotatedTokens.map(({ symbol }) => symbol))];

    const phonemes = symbols.length
      ? await this.databaseService.query<PhonemeRow>(
          'SELECT p.symbol, p."styleType", p.color ' +
            'FROM "Phoneme" p ' +
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

      const separator = token.lastIndexOf('=');
      if (separator <= 0 || separator === token.length - 1) {
        return { letter: token, styleType: 'unstyled', color: null };
      }

      const spelling = token.slice(0, separator);
      const phoneme = phonemeBySymbol.get(token.slice(separator + 1));
      if (!phoneme) {
        return { letter: spelling, styleType: 'unstyled', color: null };
      }

      return {
        letter: spelling,
        styleType: phoneme.styleType,
        color: phoneme.color,
      };
    });
  }
}
