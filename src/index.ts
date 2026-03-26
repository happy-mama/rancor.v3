import "dotenv/config";

import { startClient } from "#src/client";
import "#events/ready";
import "#events/interaction";
import "#events/voice";
import "#events/reaction";
import "#events/unhandledEvents";
import "#events/messages";
import "#events/newMember";

import { commandManager } from "#commands/manager";

commandManager.generate().then(() => {
    startClient();
});
