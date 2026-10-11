import { PrismaClient, StyleType } from '../generated/prisma';

const prisma = new PrismaClient();
const consonantColor = '#555555';

const phonemes = [
  { id: 'sv-p', symbol: 'p', color: consonantColor, spellings: ['p', 'pp'] },
  { id: 'sv-b', symbol: 'b', color: consonantColor, spellings: ['b', 'bb'] },
  { id: 'sv-t', symbol: 't', color: consonantColor, spellings: ['t', 'tt'] },
  { id: 'sv-d', symbol: 'd', color: consonantColor, spellings: ['d', 'dd'] },
  {
    id: 'sv-k',
    symbol: 'k',
    color: consonantColor,
    spellings: ['k', 'kk', 'c', 'ck', 'q'],
  },
  { id: 'sv-g', symbol: 'ɡ', color: consonantColor, spellings: ['g', 'gg'] },
  { id: 'sv-f', symbol: 'f', color: consonantColor, spellings: ['f', 'ff'] },
  { id: 'sv-v', symbol: 'v', color: consonantColor, spellings: ['v', 'w'] },
  {
    id: 'sv-s',
    symbol: 's',
    color: consonantColor,
    spellings: ['s', 'ss', 'c', 'z'],
  },
  {
    id: 'sv-sj',
    symbol: 'ɧ',
    color: '#00a650',
    spellings: ['sj', 'sk', 'skj', 'stj', 'sch', 'sh'],
  },
  {
    id: 'sv-tj',
    symbol: 'ɕ',
    color: '#9c27b0',
    spellings: ['tj', 'kj', 'k', 'ch'],
  },
  { id: 'sv-h', symbol: 'h', color: consonantColor, spellings: ['h'] },
  { id: 'sv-m', symbol: 'm', color: consonantColor, spellings: ['m', 'mm'] },
  { id: 'sv-n', symbol: 'n', color: consonantColor, spellings: ['n', 'nn'] },
  { id: 'sv-ng', symbol: 'ŋ', color: consonantColor, spellings: ['ng', 'n'] },
  { id: 'sv-l', symbol: 'l', color: consonantColor, spellings: ['l', 'll'] },
  { id: 'sv-r', symbol: 'r', color: consonantColor, spellings: ['r', 'rr'] },
  {
    id: 'sv-j',
    symbol: 'j',
    color: consonantColor,
    spellings: ['j', 'dj', 'gj', 'hj', 'lj', 'g'],
  },
  { id: 'sv-i-long', symbol: 'iː', color: '#0057b8', spellings: ['i'] },
  { id: 'sv-i-short', symbol: 'ɪ', color: '#c62828', spellings: ['i'] },
  { id: 'sv-y-long', symbol: 'yː', color: '#6a1b9a', spellings: ['y'] },
  { id: 'sv-y-short', symbol: 'ʏ', color: '#00838f', spellings: ['y'] },
  { id: 'sv-u-long', symbol: 'ʉː', color: '#b71c1c', spellings: ['u'] },
  { id: 'sv-u-short', symbol: 'ɵ', color: '#1565c0', spellings: ['u'] },
  { id: 'sv-o-long', symbol: 'uː', color: '#006064', spellings: ['o'] },
  { id: 'sv-o-short', symbol: 'ʊ', color: '#ef6c00', spellings: ['o'] },
  { id: 'sv-e-long', symbol: 'eː', color: '#8d4e00', spellings: ['e'] },
  { id: 'sv-e-short', symbol: 'e', color: '#3949ab', spellings: ['e'] },
  { id: 'sv-o-front-long', symbol: 'øː', color: '#1a237e', spellings: ['ö'] },
  { id: 'sv-o-front-short', symbol: 'œ', color: '#9c7100', spellings: ['ö'] },
  { id: 'sv-o-mid-long', symbol: 'oː', color: '#880e4f', spellings: ['å'] },
  { id: 'sv-o-mid-short', symbol: 'ɔ', color: '#0097a7', spellings: ['å'] },
  { id: 'sv-e-open-long', symbol: 'ɛː', color: '#4e342e', spellings: ['ä'] },
  {
    id: 'sv-e-open-short',
    symbol: 'ɛ',
    color: '#c2185b',
    spellings: ['ä', 'e'],
  },
  { id: 'sv-a-long', symbol: 'ɑː', color: '#4527a0', spellings: ['a'] },
  { id: 'sv-a-short', symbol: 'a', color: '#e65100', spellings: ['a'] },
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

  const sampleTexts: {
    previousTitle?: string;
    title: string;
    transcription: string;
  }[] = [
    {
      previousTitle: 'Hej kaka',
      title: 'Solen skiner över sjön.',
      transcription:
        'S=s o=uː l=l e=ɛ n=n _ sk=ɧ i=iː n=n e=ɛ r=r _ ö=øː v=v e=ɛ r=r _ sj=ɧ ö=øː n=n .',
    },
    {
      title: 'Katten sitter på stolen.',
      transcription:
        'K=k a=a tt=t e=ɛ n=n _ s=s i=ɪ tt=t e=ɛ r=r _ p=p å=oː _ s=s t=t o=uː l=l e=ɛ n=n .',
    },
    {
      title: 'Båten är blå.',
      transcription: 'B=b å=oː t=t e=ɛ n=n _ ä=ɛː r=r _ b=b l=l å=oː .',
    },
    {
      title: 'En röd bil står här.',
      transcription:
        'E=ɛ n=n _ r=r ö=øː d=d _ b=b i=iː l=l _ s=s t=t å=oː r=r _ h=h ä=ɛː r=r .',
    },
  ];

  for (const { previousTitle, title, transcription } of sampleTexts) {
    const previousSample = previousTitle
      ? await prisma.text.findFirst({ where: { title: previousTitle } })
      : undefined;
    const sample =
      previousSample ?? (await prisma.text.findFirst({ where: { title } }));

    if (sample) {
      await prisma.text.update({
        where: { id: sample.id },
        data: { title, transcription },
      });
    } else {
      await prisma.text.create({ data: { title, transcription } });
    }
  }
  console.log(`Seeded ${sampleTexts.length} sample texts.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
