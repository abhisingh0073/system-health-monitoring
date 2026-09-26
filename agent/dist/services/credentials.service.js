"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCredentials = saveCredentials;
exports.loadCredentials = loadCredentials;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const promises_1 = require("fs/promises");
const CREDENTIALS_DIR = path_1.default.join(os_1.default.homedir(), ".system-health-monitor");
const CREDENTIALS_PATH = path_1.default.join(CREDENTIALS_DIR, "credentials.json");
async function saveCredentials(credentials) {
    await (0, promises_1.mkdir)(CREDENTIALS_DIR, { recursive: true });
    await (0, promises_1.writeFile)(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2), "utf-8");
    await (0, promises_1.chmod)(CREDENTIALS_PATH, 0o600);
}
async function loadCredentials() {
    try {
        const data = await (0, promises_1.readFile)(CREDENTIALS_PATH, "utf-8");
        const credentials = JSON.parse(data);
        if (!credentials.serverId || !credentials.agentToken) {
            return null;
        }
        return credentials;
    }
    catch {
        return null;
    }
}
