import { VoiceState } from "discord.js";

import { client } from "#src/client";
import { Logger } from "#src/utils/logger";
import { voiceService } from "#repo/voice";

class VoiceEvents {
    private logger = new Logger("EVENTS:voice");

    constructor() {
        client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
            // ignore useless mic mute updates
            if (oldVoiceState.channelId == newVoiceState.channelId) return;

            // ignore channel switch updates
            if (oldVoiceState.channelId && newVoiceState.channelId) return;

            if (oldVoiceState.channelId) {
                this.voiceChannelLeave({ oldVoiceState, newVoiceState });
            }

            if (newVoiceState.channelId) {
                this.voiceChannelJoin({ oldVoiceState, newVoiceState });
            }
        });
    }

    private voiceChannelJoin({
        oldVoiceState,
        newVoiceState,
    }: {
        oldVoiceState: VoiceState;
        newVoiceState: VoiceState;
    }) {
        if (!newVoiceState.member?.user.id) return;

        this.logger.debug(
            `member "${newVoiceState.member.user.username}" joined voice channel`,
        );

        voiceService.startSession(newVoiceState.member.user.id);
    }

    private voiceChannelLeave({
        oldVoiceState,
        newVoiceState,
    }: {
        oldVoiceState: VoiceState;
        newVoiceState: VoiceState;
    }) {
        if (!oldVoiceState.member?.user.id) return;

        this.logger.debug(
            `member "${oldVoiceState.member.user.username}" left voice channel`,
        );

        voiceService.endSession(oldVoiceState.member.user.id);
    }
}

export const voiceEvents = new VoiceEvents();
