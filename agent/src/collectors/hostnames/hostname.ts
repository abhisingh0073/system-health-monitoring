import os from "os";

export function getHostname(): string {
  return os.hostname();
}