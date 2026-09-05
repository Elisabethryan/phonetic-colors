import { Injectable } from '@nestjs/common';
import { ExtendedListItem } from '../types/general/stringList';
import { v4 as uuidv4 } from 'uuid';
import { DbText, Text } from 'src/types/general/text';
import { LatinLetter } from 'src/types/general/latinLetter';
import { FormattedLetter, Style } from 'src/types/general/letter';

@Injectable()
export class TextService {
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

  mockDbText: DbText = {
    id: '123456',
    text: ['1', '2', '2', '1'],
  };

  texts: Text[] = [this.text];

  getText(textId: string): Text | undefined {
    console.log(textId);
    const text = this.texts.find((doc) => doc.id === textId);
    return text;
  }

  dbLoadText(textId: string): Text | undefined {
    //TODO rethink solution when we have a connection to postgres
    const dbText = this.mockDbText;
    const formattedLetterText: FormattedLetter[] = dbText.text.map(
      (letterId) => {
        const formattedLetter = this.mockDbFormattedLetters.find((letter) => {
          return letterId === letter.id;
        });
        if (formattedLetter) {
          return formattedLetter;
        } else {
          throw Error('Could not find letter');
        }
      },
    );
    return {
      ...dbText,
      text: formattedLetterText,
    };
  }
}
