import { Injectable } from '@nestjs/common';
import { DbText, Text } from 'src/types/general/text';
import { LatinLetter } from 'src/types/general/latinLetter';
import { FormattedLetter, Style } from 'src/types/general/letter';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class TextService {
  constructor(private databaseService: DatabaseService) {}
  //TEMPORARY TEST DATA
  //TODO make these types make sense
  formattedA = {
    id: '1',
    letter: 'A' as LatinLetter,
    style: { type: 'colored', color: 'pink' } as Style,
  };

  formattedB = {
    id: '2',
    letter: 'B' as LatinLetter,
    style: { type: 'colored', color: 'green' } as Style,
  };

  mockDbFormattedLetters = [this.formattedA, this.formattedB];

  text: Text = {
    id: '12345',
    text: [this.formattedA, this.formattedB, this.formattedB, this.formattedA],
  };

  mockDbTexts: DbText[] = [
    {
      id: '12345',
      text: [
        '7a8e7b05-3872-4ffb-9a9e-1b580043e270',
        '4933c72e-78c5-4f84-a66d-64cdd56d61e9',
        '7a8e7b05-3872-4ffb-9a9e-1b580043e270',
        '4933c72e-78c5-4f84-a66d-64cdd56d61e9',
      ],
    },
  ];

  texts: Text[] = [this.text];

  async getFormattedLettersFromIds(
    letterIds: string[],
  ): Promise<FormattedLetter[]> {
    //todo is going to the database each time inefficient?
    const formattedLetters = (await this.databaseService.query(
      'SELECT * FROM "FormattedLetter" where id IN (' +
        letterIds.map((id) => `'${id}'`).join(',') +
        ')',
    )) as FormattedLetter[];
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
    // const texts = await this.databaseService.query(
    //   'SELECT * FROM "DbText" WHERE id=' + `'${textId}'`,
    // );

    const text = this.mockDbTexts.find((doc) => doc.id === textId);

    if (!text) {
      return undefined;
    }

    return {
      id: text.id,
      text: await this.getFormattedLettersFromIds(text.text),
    };
  }

  dbLoadText(textId: string): Text | undefined {
    return;
    //TODO rethink solution when we have a connection to postgres
    // const dbText = this.mockDbText;
    // const formattedLetterText: FormattedLetter[] = dbText.text.map(
    //   (letterId) => {
    //     const formattedLetter = this.mockDbFormattedLetters.find((letter) => {
    //       return letterId === letter.id;
    //     });
    //     if (formattedLetter) {
    //       return formattedLetter;
    //     } else {
    //       throw Error('Could not find letter');
    //     }
    //   },
    // );
    // return {
    //   ...dbText,
    //   text: formattedLetterText,
    // };
  }
}
