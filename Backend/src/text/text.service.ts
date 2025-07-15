import { Injectable } from '@nestjs/common';
import { ExtendedListItem } from '../types/general/stringList';
import { v4 as uuidv4 } from 'uuid';
import { Text } from 'src/types/general/text';
import { LatinLetter } from 'src/types/general/latinLetter';
import { Style } from 'src/types/general/letter';

@Injectable()
export class TextService {
  //TEMPORARY TEST DATA
  formattedA = {
    id: '1',
    letter: 'A' as LatinLetter,
    style: 'colored' as Style, //{ type: 'colored', color: 'green' },
  };

  formattedB = {
    id: '2',
    letter: 'B' as LatinLetter,
    style: 'colored' as Style, //{ type: 'colored', color: 'green' },
  };

  text: Text = {
    id: '12345',
    text: [this.formattedA, this.formattedB, this.formattedB, this.formattedA],
  };

  texts: Text[] = [this.text];

  getText(textId: string): Text | undefined {
    console.log(textId);
    const text = this.texts.find((doc) => doc.id === textId);
    return text;
  }
}
