-- CreateTable
CREATE TABLE "Phoneme" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "styleType" "StyleType" NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phoneme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhonemeSpelling" (
    "id" TEXT NOT NULL,
    "phonemeId" TEXT NOT NULL,
    "spelling" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhonemeSpelling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Phoneme_symbol_key" ON "Phoneme"("symbol");

-- AddForeignKey
ALTER TABLE "PhonemeSpelling" ADD CONSTRAINT "PhonemeSpelling_phonemeId_fkey" FOREIGN KEY ("phonemeId") REFERENCES "Phoneme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
