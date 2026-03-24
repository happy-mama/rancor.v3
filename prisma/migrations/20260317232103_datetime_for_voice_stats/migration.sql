/*
  Warnings:

  - The `end_time` column on the `VoiceSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `start_time` on the `VoiceSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VoiceSession" DROP COLUMN "start_time",
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end_time",
ADD COLUMN     "end_time" TIMESTAMP(3);
