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

  async getText(textId: string): Promise<Text | undefined> {
    console.log('IM IN T`GET TEXT');
    console.log(textId);
    const formattedLetters = (await this.databaseService.query(
      'SELECT * FROM "FormattedLetter"',
    )) as FormattedLetter[];
    const text = this.mockDbTexts.find((doc) => doc.id === textId);

    if (!text) {
      return undefined;
    }
    const formattedLetterText = text?.text.map((letterId) => {
      const letter = formattedLetters.find(
        (formattedLetter) => formattedLetter.id === letterId,
      );
      if (letter) {
        return letter;
      } else {
        throw Error('Could not find letter');
      }
    });

    return { id: text.id, text: formattedLetterText };
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
