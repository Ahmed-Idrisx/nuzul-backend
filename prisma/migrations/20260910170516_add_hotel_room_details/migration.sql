/*
  Warnings:

  - Added the required column `description` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGuests` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Hotel" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "facilities" TEXT[],
ADD COLUMN     "shortDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "maxGuests" INTEGER NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL;
