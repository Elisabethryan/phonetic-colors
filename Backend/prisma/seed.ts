import { PrismaClient, StyleType } from '../generated/prisma';

const prisma = new PrismaClient();

const phonemes = [
  { id: 'sv-p', symbol: 'p', color: '#b42318', spellings: ['p', 'pp'] },
  { id: 'sv-b', symbol: 'b', color: '#c2410c', spellings: ['b', 'bb'] },
  { id: 'sv-t', symbol: 't', color: '#a16207', spellings: ['t', 'tt'] },
  { id: 'sv-d', symbol: 'd', color: '#4d7c0f', spellings: ['d', 'dd'] },
  {
    id: 'sv-k',
    symbol: 'k',
    color: '#047857',
    spellings: ['k', 'kk', 'c', 'ck', 'q'],
  },
  { id: 'sv-g', symbol: 'ɡ', color: '#0f766e', spellings: ['g', 'gg'] },
  { id: 'sv-f', symbol: 'f', color: '#0e7490', spellings: ['f', 'ff'] },
  { id: 'sv-v', symbol: 'v', color: '#0369a1', spellings: ['v', 'w'] },
  {
    id: 'sv-s',
    symbol: 's',
    color: '#1d4ed8',
    spellings: ['s', 'ss', 'c', 'z'],
  },
  {
    id: 'sv-sj',
    symbol: 'ɧ',
    color: '#4338ca',
    spellings: ['sj', 'sk', 'skj', 'stj', 'sch', 'sh'],
  },
  {
    id: 'sv-tj',
    symbol: 'ɕ',
    color: '#7e22ce',
    spellings: ['tj', 'kj', 'k', 'ch'],
  },
  { id: 'sv-h', symbol: 'h', color: '#a21caf', spellings: ['h'] },
  { id: 'sv-m', symbol: 'm', color: '#be123c', spellings: ['m', 'mm'] },
  { id: 'sv-n', symbol: 'n', color: '#b45309', spellings: ['n', 'nn'] },
  { id: 'sv-ng', symbol: 'ŋ', color: '#3f6212', spellings: ['ng', 'n'] },
  { id: 'sv-l', symbol: 'l', color: '#15803d', spellings: ['l', 'll'] },
  { id: 'sv-r', symbol: 'r', color: '#155e75', spellings: ['r', 'rr'] },
  {
    id: 'sv-j',
    symbol: 'j',
    color: '#075985',
    spellings: ['j', 'dj', 'gj', 'hj', 'lj', 'g'],
  },
  { id: 'sv-i-long', symbol: 'iː', color: '#1e40af', spellings: ['i'] },
  { id: 'sv-i-short', symbol: 'ɪ', color: '#3730a3', spellings: ['i'] },
  { id: 'sv-y-long', symbol: 'yː', color: '#5b21b6', spellings: ['y'] },
  { id: 'sv-y-short', symbol: 'ʏ', color: '#86198f', spellings: ['y'] },
  { id: 'sv-u-long', symbol: 'ʉː', color: '#9f1239', spellings: ['u'] },
  { id: 'sv-u-short', symbol: 'ɵ', color: '#9a3412', spellings: ['u'] },
  { id: 'sv-o-long', symbol: 'uː', color: '#1f5f5b', spellings: ['o'] },
  { id: 'sv-o-short', symbol: 'ʊ', color: '#5f4b32', spellings: ['o'] },
  { id: 'sv-e-long', symbol: 'eː', color: '#6b3f2a', spellings: ['e'] },
  { id: 'sv-e-short', symbol: 'e', color: '#594157', spellings: ['e'] },
  { id: 'sv-o-front-long', symbol: 'øː', color: '#385723', spellings: ['ö'] },
  { id: 'sv-o-front-short', symbol: 'œ', color: '#4f375b', spellings: ['ö'] },
  { id: 'sv-o-mid-long', symbol: 'oː', color: '#7a3e48', spellings: ['å'] },
  { id: 'sv-o-mid-short', symbol: 'ɔ', color: '#3b5b7a', spellings: ['å'] },
  { id: 'sv-e-open-long', symbol: 'ɛː', color: '#635b26', spellings: ['ä'] },
  {
    id: 'sv-e-open-short',
    symbol: 'ɛ',
    color: '#7a522f',
    spellings: ['ä', 'e'],
  },
  { id: 'sv-a-long', symbol: 'ɑː', color: '#365c52', spellings: ['a'] },
  { id: 'sv-a-short', symbol: 'a', color: '#5c3c3c', spellings: ['a'] },
] as const;

const legacyPhonemeIds = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k-hard',
  'k-soft',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

async function main() {
  await prisma.phonemeSpelling.deleteMany({
    where: { phonemeId: { in: legacyPhonemeIds } },
  });
  await prisma.phoneme.deleteMany({
    where: { id: { in: legacyPhonemeIds } },
  });

  for (const { id, symbol, color, spellings } of phonemes) {
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

  const sampleTitle = 'Hej kaka';
  const transcription = 'H=h e=ɛ j=j _ k=k a=ɑː k=k a=a';
  const sample = await prisma.text.findFirst({ where: { title: sampleTitle } });
  if (sample) {
    await prisma.text.update({
      where: { id: sample.id },
      data: { transcription },
    });
  } else {
    await prisma.text.create({ data: { title: sampleTitle, transcription } });
  }
  console.log(`Seeded sample text "${sampleTitle}".`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
