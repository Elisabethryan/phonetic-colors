import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TextService } from './text.service';

describe('TextService', () => {
  const prisma = {
    text: { findUnique: jest.fn() },
  } as unknown as PrismaService;
  let service: TextService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TextService(prisma);
  });

  it('returns formatted letters in their stored position order', async () => {
    (prisma.text.findUnique as jest.Mock).mockResolvedValue({
      id: '12345',
      textLetters: [
        {
          position: 0,
          formattedLetter: {
            id: 'a',
            letter: 'A',
            styleType: 'colored',
            color: 'pink',
          },
        },
        {
          position: 1,
          formattedLetter: {
            id: 'b',
            letter: 'B',
            styleType: 'underlined',
            color: null,
          },
        },
      ],
    });

    await expect(service.getText('12345')).resolves.toEqual({
      id: '12345',
      text: [
        { id: 'a', letter: 'A', styleType: 'colored', color: 'pink' },
        { id: 'b', letter: 'B', styleType: 'underlined', color: null },
      ],
    });
    expect(prisma.text.findUnique).toHaveBeenCalledWith({
      where: { id: '12345' },
      include: {
        textLetters: {
          orderBy: { position: 'asc' },
          include: { formattedLetter: true },
        },
      },
    });
  });

  it('throws NotFoundException for an unknown text', async () => {
    (prisma.text.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getText('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});