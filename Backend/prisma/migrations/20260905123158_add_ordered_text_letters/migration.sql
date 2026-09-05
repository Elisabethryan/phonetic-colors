-- CreateEnum
CREATE TYPE "StyleType" AS ENUM ('unstyled', 'underlined', 'colored');

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormattedLetter" (
    "id" TEXT NOT NULL,
    "letter" TEXT NOT NULL,
    "styleType" "StyleType" NOT NULL DEFAULT 'unstyled',
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormattedLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextLetter" (
    "id" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "formattedLetterId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TextLetter_formattedLetterId_idx" ON "TextLetter"("formattedLetterId");

-- CreateIndex
CREATE UNIQUE INDEX "TextLetter_textId_position_key" ON "TextLetter"("textId", "position");

-- AddForeignKey
ALTER TABLE "TextLetter" ADD CONSTRAINT "TextLetter_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextLetter" ADD CONSTRAINT "TextLetter_formattedLetterId_fkey" FOREIGN KEY ("formattedLetterId") REFERENCES "FormattedLetter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
