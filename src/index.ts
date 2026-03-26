import "dotenv/config";

import { startClient } from "#src/client";
import "#events/ready";
import "#events/interaction";
import "#events/voice";
import "#events/reaction";
import "#events/unhandledEvents";

import { commandManager } from "#commands/manager";

commandManager.generate().then(() => {
    startClient();
});
