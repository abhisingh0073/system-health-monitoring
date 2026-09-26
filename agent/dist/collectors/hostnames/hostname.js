"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostname = getHostname;
const os_1 = __importDefault(require("os"));
function getHostname() {
    return os_1.default.hostname();
}
