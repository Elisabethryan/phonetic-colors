import 'dotenv/config';
import { PrismaClient, StyleType } from '@prisma/client';

const prisma = new PrismaClient();

const poem = 'Innehållet av en dikt.';
const coloredVowels = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'å', 'ä', 'ö']);

const sampleLetters = [
  { id: 'sample-l', letter: 'L', styleType: StyleType.unstyled, color: null },
  {
    id: 'sample-a-umlaut',
    letter: 'ä',
    styleType: StyleType.colored,
    color: 'crimson',
  },
  { id: 'sample-s', letter: 's', styleType: StyleType.unstyled, color: null },
  {
    id: 'sample-space',
    letter: ' ',
    styleType: StyleType.unstyled,
    color: null,
  },
  { id: 'sample-h', letter: 'h', styleType: StyleType.unstyled, color: null },
  {
    id: 'sample-o-umlaut',
    letter: 'ö',
    styleType: StyleType.underlined,
    color: null,
  },
  { id: 'sample-g', letter: 'g', styleType: StyleType.unstyled, color: null },
  {
    id: 'sample-t',
    letter: 't',
    styleType: StyleType.colored,
    color: 'royalblue',
  },
  {
    id: 'sample-period',
    letter: '.',
    styleType: StyleType.unstyled,
    color: null,
  },
];

async function main() {
  await Promise.all(
    sampleLetters.map(({ id, ...letter }) =>
      prisma.formattedLetter.upsert({
        where: { id },
        update: letter,
        create: { id, ...letter },
      }),
    ),
  );

  await prisma.text.upsert({
    where: { id: '12345' },
    update: { title: 'Läs högt.', content: 'Läs högt.' },
    create: { id: '12345', title: 'Läs högt.', content: 'Läs högt.' },
  });

  await prisma.text.upsert({
    where: { id: '2345678' },
    update: { title: 'Dikt', content: poem },
    create: { id: '2345678', title: 'Dikt', content: poem },
  });

  await Promise.all(
    [...new Set(poem)].map((character) => {
      const id = `poem-${character.codePointAt(0)}`;
      const isColoredVowel = coloredVowels.has(character.toLowerCase());
      const letter = {
        letter: character,
        styleType: isColoredVowel ? StyleType.colored : StyleType.unstyled,
        color: isColoredVowel ? 'royalblue' : null,
      };

      return prisma.formattedLetter.upsert({
        where: { id },
        update: letter,
        create: { id, ...letter },
      });
    }),
  );

  await prisma.textLetter.deleteMany({ where: { textId: '12345' } });
  await prisma.textLetter.createMany({
    data: [
      'sample-l',
      'sample-a-umlaut',
      'sample-s',
      'sample-space',
      'sample-h',
      'sample-o-umlaut',
      'sample-g',
      'sample-t',
      'sample-period',
    ].map((formattedLetterId, position) => ({
      textId: '12345',
      formattedLetterId,
      position,
    })),
  });

  await prisma.textLetter.deleteMany({ where: { textId: '2345678' } });
  await prisma.textLetter.createMany({
    data: [...poem].map((character, position) => ({
      textId: '2345678',
      formattedLetterId: `poem-${character.codePointAt(0)}`,
      position,
    })),
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
