import { PrismaClient, StyleType } from '../generated/prisma';

const prisma = new PrismaClient();

const phonemes = [
  { id: 'sv-p', symbol: 'p', color: '#e42538', spellings: ['p', 'pp'] },
  { id: 'sv-b', symbol: 'b', color: '#7f6d10', spellings: ['b', 'bb'] },
  { id: 'sv-t', symbol: 't', color: '#649a13', spellings: ['t', 'tt'] },
  { id: 'sv-d', symbol: 'd', color: '#107f44', spellings: ['d', 'dd'] },
  {
    id: 'sv-k',
    symbol: 'k',
    color: '#a67707',
    spellings: ['k', 'kk', 'c', 'ck', 'q'],
  },
  { id: 'sv-g', symbol: 'ɡ', color: '#657f10', spellings: ['g', 'gg'] },
  { id: 'sv-f', symbol: 'f', color: '#107f78', spellings: ['f', 'ff'] },
  { id: 'sv-v', symbol: 'v', color: '#107f5e', spellings: ['v', 'w'] },
  {
    id: 'sv-s',
    symbol: 's',
    color: '#f514d7',
    spellings: ['s', 'ss', 'c', 'z'],
  },
  {
    id: 'sv-sj',
    symbol: 'ɧ',
    color: '#139a49',
    spellings: ['sj', 'sk', 'skj', 'stj', 'sch', 'sh'],
  },
  {
    id: 'sv-tj',
    symbol: 'ɕ',
    color: '#b81ad1',
    spellings: ['tj', 'kj', 'k', 'ch'],
  },
  { id: 'sv-h', symbol: 'h', color: '#c47908', spellings: ['h'] },
  { id: 'sv-m', symbol: 'm', color: '#9a6013', spellings: ['m', 'mm'] },
  { id: 'sv-n', symbol: 'n', color: '#aa14f5', spellings: ['n', 'nn'] },
  { id: 'sv-ng', symbol: 'ŋ', color: '#07a637', spellings: ['ng', 'n'] },
  { id: 'sv-l', symbol: 'l', color: '#e10951', spellings: ['l', 'll'] },
  { id: 'sv-r', symbol: 'r', color: '#146ef5', spellings: ['r', 'rr'] },
  {
    id: 'sv-j',
    symbol: 'j',
    color: '#d11aac',
    spellings: ['j', 'dj', 'gj', 'hj', 'lj', 'g'],
  },
  { id: 'sv-i-long', symbol: 'iː', color: '#f5141b', spellings: ['i'] },
  { id: 'sv-i-short', symbol: 'ɪ', color: '#079ca6', spellings: ['i'] },
  { id: 'sv-y-long', symbol: 'yː', color: '#d13e1a', spellings: ['y'] },
  { id: 'sv-y-short', symbol: 'ʏ', color: '#1676b6', spellings: ['y'] },
  { id: 'sv-u-long', symbol: 'ʉː', color: '#b66116', spellings: ['u'] },
  { id: 'sv-u-short', symbol: 'ɵ', color: '#137b9a', spellings: ['u'] },
  { id: 'sv-o-long', symbol: 'uː', color: '#1a9ad1', spellings: ['o'] },
  { id: 'sv-o-short', symbol: 'ʊ', color: '#f55014', spellings: ['o'] },
  { id: 'sv-e-long', symbol: 'eː', color: '#e614f5', spellings: ['e'] },
  { id: 'sv-e-short', symbol: 'e', color: '#e16709', spellings: ['e'] },
  { id: 'sv-o-front-long', symbol: 'øː', color: '#e1098b', spellings: ['ö'] },
  { id: 'sv-o-front-short', symbol: 'œ', color: '#2585e4', spellings: ['ö'] },
  { id: 'sv-o-mid-long', symbol: 'oː', color: '#9a9113', spellings: ['å'] },
  { id: 'sv-o-mid-short', symbol: 'ɔ', color: '#f514b2', spellings: ['å'] },
  { id: 'sv-e-open-long', symbol: 'ɛː', color: '#f5147d', spellings: ['ä'] },
  {
    id: 'sv-e-open-short',
    symbol: 'ɛ',
    color: '#31a607',
    spellings: ['ä', 'e'],
  },
  { id: 'sv-a-long', symbol: 'ɑː', color: '#317f10', spellings: ['a'] },
  { id: 'sv-a-short', symbol: 'a', color: '#d11a69', spellings: ['a'] },
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
