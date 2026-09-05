import { Injectable, NotFoundException } from '@nestjs/common';
import { Text } from 'src/types/general/text';
import { LatinLetter } from 'src/types/general/latinLetter';
import { StyleType } from 'src/types/general/letter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TextService {
  constructor(private prisma: PrismaService) {}

  async getText(textId: string): Promise<Text> {
    const text = await this.prisma.text.findUnique({
      where: { id: textId },
      include: {
        textLetters: {
          orderBy: { position: 'asc' },
          include: { formattedLetter: true },
        },
      },
    });

    if (!text) {
      throw new NotFoundException(`Text ${textId} was not found`);
    }

    return {
      id: text.id,
      text: text.textLetters.map(({ formattedLetter }) =>
        this.toFormattedLetter(formattedLetter),
      ),
    };
  }

  private toFormattedLetter({
    id,
    letter,
    styleType,
    color,
  }: {
    id: string;
    letter: string;
    styleType: string;
    color: string | null;
  }): Text['text'][number] {
    return {
      id,
      letter: letter as LatinLetter,
      styleType: styleType as StyleType,
      color,
    };
  }
}
