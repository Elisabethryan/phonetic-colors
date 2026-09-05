import 'dotenv/config';
import { PrismaClient, StyleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pinkA = await prisma.formattedLetter.upsert({
    where: { id: 'sample-pink-a' },
    update: { letter: 'A', styleType: StyleType.colored, color: 'pink' },
    create: {
      id: 'sample-pink-a',
      letter: 'A',
      styleType: StyleType.colored,
      color: 'pink',
    },
  });

  const greenB = await prisma.formattedLetter.upsert({
    where: { id: 'sample-green-b' },
    update: { letter: 'B', styleType: StyleType.colored, color: 'green' },
    create: {
      id: 'sample-green-b',
      letter: 'B',
      styleType: StyleType.colored,
      color: 'green',
    },
  });

  await prisma.text.upsert({
    where: { id: '12345' },
    update: { title: 'Exempeltext' },
    create: { id: '12345', title: 'Exempeltext' },
  });

  await prisma.textLetter.deleteMany({ where: { textId: '12345' } });
  await prisma.textLetter.createMany({
    data: [
      { textId: '12345', formattedLetterId: pinkA.id, position: 0 },
      { textId: '12345', formattedLetterId: greenB.id, position: 1 },
      { textId: '12345', formattedLetterId: greenB.id, position: 2 },
      { textId: '12345', formattedLetterId: pinkA.id, position: 3 },
    ],
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