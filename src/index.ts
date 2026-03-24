import "dotenv/config";

import { startClient } from "#src/client";
import "#events/ready";
import "#events/interaction";
import "#events/voice";

import { commandManager } from "#commands/manager";

commandManager.generate().then(() => {
    startClient();
});
