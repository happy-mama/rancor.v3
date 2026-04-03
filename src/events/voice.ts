import type { VoiceState } from "discord.js";
import { voiceService } from "#repo/voice";
import { client } from "#src/client";
import { Logger } from "#src/utils/logger";

const logger = new Logger("EVENTS:voice");

const voiceChannelJoin = ({
	oldVoiceState,
	newVoiceState,
}: {
	oldVoiceState: VoiceState;
	newVoiceState: VoiceState;
}) => {
	if (!newVoiceState.member?.user.id) return;

	logger.debug(
		`member "${newVoiceState.member.user.username}" joined voice channel`,
	);

	voiceService.startSession(newVoiceState.member.user.id);
};

const voiceChannelLeave = ({
	oldVoiceState,
	newVoiceState,
}: {
	oldVoiceState: VoiceState;
	newVoiceState: VoiceState;
}) => {
	if (!oldVoiceState.member?.user.id) return;

	logger.debug(
		`member "${oldVoiceState.member.user.username}" left voice channel`,
	);

	voiceService.endSession(oldVoiceState.member.user.id);
};

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
	// ignore useless mic mute updates
	if (oldVoiceState.channelId === newVoiceState.channelId) return;

	// ignore channel switch updates
	if (oldVoiceState.channelId && newVoiceState.channelId) return;

	if (oldVoiceState.channelId) {
		voiceChannelLeave({ oldVoiceState, newVoiceState });
	}

	if (newVoiceState.channelId) {
		voiceChannelJoin({ oldVoiceState, newVoiceState });
	}
});
