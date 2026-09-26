"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUptime = getUptime;
const os_1 = __importDefault(require("os"));
function getUptime() {
    const uptime = Math.floor(os_1.default.uptime());
    return uptime;
}
