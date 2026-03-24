/*
  Warnings:

  - The primary key for the `VoiceSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VoiceSession` table. All the data in the column will be lost.
  - Made the column `end_time` on table `VoiceSession` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VoiceSessionState" AS ENUM ('ACTIVE', 'ENDED');

-- AlterTable
ALTER TABLE "Stats" ALTER COLUMN "voice_time" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "VoiceSession" DROP CONSTRAINT "VoiceSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "state" "VoiceSessionState" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "end_time" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "VoiceSession_pkey" PRIMARY KEY ("user_id");
