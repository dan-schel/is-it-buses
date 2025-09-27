/* eslint-disable no-console */

import { Logger } from "@/server/services/logger/logger";

export class ConsoleLogger extends Logger {
  info(...message: unknown[]): void {
    console.log(...message);
  }

  warn(...message: unknown[]): void {
    console.warn(...message);
  }
}
