import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DbText, Text } from 'src/types/general/text';
import { DbFormattedLetter, StyleType } from 'src/types/general/letter';
import { DatabaseService } from '../db/database.service';
import { CreateFormattedLetterDto, CreateTextDto } from './dto/create-text.dto';

@Injectable()
export class TextService {
  constructor(private databaseService: DatabaseService) {}

  async getFormattedLettersFromIds(
    letterIds: string[],
  ): Promise<DbFormattedLetter[]> {
    if (letterIds.length === 0) {
      return [];
    }

    const formattedLetters = (await this.databaseService.query(
      'SELECT id, letter, "styleType", color FROM "FormattedLetter" WHERE id = ANY($1::uuid[])',
      [letterIds],
    )) as DbFormattedLetter[];

    const formattedLetterText = letterIds.map((letterId) => {
      const letter = formattedLetters.find(
        (formattedLetter) => formattedLetter.id === letterId,
      );
      if (!letter) {
        throw new Error('Could not find letter');
      }
      return letter;
    });

    return formattedLetterText;
  }

  async getText(textId: string): Promise<Text | undefined> {
    const numericTextId = Number(textId);
    if (Number.isNaN(numericTextId)) {
      return undefined;
    }

    const texts = await this.databaseService.query<DbText>(
      'SELECT id, content FROM "Text" WHERE id = $1',
      [numericTextId],
    );
    const text = texts[0];

    if (!text) {
      return undefined;
    }

    return {
      id: String(text.id),
      text: await this.getFormattedLettersFromIds(text.content),
    };
  }

  async getLatestText(): Promise<Text | undefined> {
    const texts = await this.databaseService.query<DbText>(
      'SELECT id, content FROM "Text" ORDER BY "createdAt" DESC LIMIT 1',
    );
    const text = texts[0];
    if (!text) {
      return undefined;
    }

    return {
      id: String(text.id),
      text: await this.getFormattedLettersFromIds(text.content),
    };
  }

  async createText(createTextDto: CreateTextDto): Promise<Text> {
    const insertedLetters: DbFormattedLetter[] = [];

    for (const letter of createTextDto.formattedLetters) {
      const inserted = await this.createFormattedLetter(letter);
      insertedLetters.push(inserted);
    }

    const insertedTextRows = await this.databaseService.query<DbText>(
      'INSERT INTO "Text" (content) VALUES ($1::text[]) RETURNING id, content',
      [insertedLetters.map((letter) => letter.id)],
    );

    return {
      id: String(insertedTextRows[0].id),
      text: insertedLetters,
    };
  }

  private async createFormattedLetter(
    letter: CreateFormattedLetterDto,
  ): Promise<DbFormattedLetter> {
    const id = randomUUID();
    const color =
      letter.styleType === StyleType.COLORED ? (letter.color ?? 'black') : null;

    const insertedRows = await this.databaseService.query<DbFormattedLetter>(
      'INSERT INTO "FormattedLetter" (id, letter, "styleType", color) VALUES ($1, $2, $3, $4) RETURNING id, letter, "styleType", color',
      [id, letter.letter, letter.styleType, color],
    );

    return insertedRows[0];
  }
}
