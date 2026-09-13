import { PrismaClient, StyleType } from '../generated/prisma';

const prisma = new PrismaClient();

// [id, symbol, color, spellings]. Two phonemes can share a spelling, e.g. Swedish
// hard k /k/ vs soft k /ɕ/ are both written "K" but colored differently.
const phonemes = [
  ['a', 'A', '#b42318', ['A']],
  ['b', 'B', '#c2410c', ['B']],
  ['c', 'C', '#a16207', ['C']],
  ['d', 'D', '#4d7c0f', ['D']],
  ['e', 'E', '#047857', ['E']],
  ['f', 'F', '#0f766e', ['F']],
  ['g', 'G', '#0e7490', ['G']],
  ['h', 'H', '#0369a1', ['H']],
  ['i', 'I', '#1d4ed8', ['I']],
  ['j', 'J', '#4338ca', ['J']],
  ['k-hard', 'k', '#1d4ed8', ['K']],
  ['k-soft', 'ɕ', '#b42318', ['K']],
  ['l', 'L', '#7e22ce', ['L']],
  ['m', 'M', '#a21caf', ['M']],
  ['n', 'N', '#be123c', ['N']],
  ['o', 'O', '#b45309', ['O']],
  ['p', 'P', '#3f6212', ['P']],
  ['q', 'Q', '#15803d', ['Q']],
  ['r', 'R', '#0f766e', ['R']],
  ['s', 'S', '#155e75', ['S']],
  ['t', 'T', '#075985', ['T']],
  ['u', 'U', '#1e40af', ['U']],
  ['v', 'V', '#3730a3', ['V']],
  ['w', 'W', '#5b21b6', ['W']],
  ['x', 'X', '#86198f', ['X']],
  ['y', 'Y', '#9f1239', ['Y']],
  ['z', 'Z', '#9a3412', ['Z']],
] as const;

async function main() {
  for (const [id, symbol, color, spellings] of phonemes) {
    await prisma.phoneme.upsert({
      where: { id },
      update: { symbol, styleType: StyleType.colored, color },
      create: { id, symbol, styleType: StyleType.colored, color },
    });

    await prisma.phonemeSpelling.deleteMany({ where: { phonemeId: id } });
    await prisma.phonemeSpelling.createMany({
      data: spellings.map((spelling) => ({ phonemeId: id, spelling })),
    });
  }

  console.log(`Seeded ${phonemes.length} phonemes.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
