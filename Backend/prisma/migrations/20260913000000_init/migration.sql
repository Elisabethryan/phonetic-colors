-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "StyleType" AS ENUM ('unstyled', 'underlined', 'colored');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Text" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "FormattedLetter" (
    "id" TEXT NOT NULL,
    "letter" TEXT NOT NULL,
    "styleType" "StyleType" NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormattedLetter_pkey" PRIMARY KEY ("id")
);