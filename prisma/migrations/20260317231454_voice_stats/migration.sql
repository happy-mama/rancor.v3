-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "VoiceSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER,

    CONSTRAINT "VoiceSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VoiceSession" ADD CONSTRAINT "VoiceSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
