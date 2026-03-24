-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_user_id_fkey";

-- DropForeignKey
ALTER TABLE "VoiceSession" DROP CONSTRAINT "VoiceSession_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceSession" ADD CONSTRAINT "VoiceSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
