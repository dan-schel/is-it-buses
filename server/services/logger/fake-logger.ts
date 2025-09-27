import { Logger } from "@/server/services/logger/logger";

export class FakeLogger extends Logger {
  private readonly _logs: { severity: string; message: unknown[] }[] = [];

  info(...message: unknown[]): void {
    this._logs.push({ severity: "info", message: message });
  }

  warn(...message: unknown[]): void {
    this._logs.push({ severity: "warn", message: message });
  }

  hasInfo(...message: unknown[]): boolean {
    return this._has("info", message);
  }

  hasWarn(...message: unknown[]): boolean {
    return this._has("warn", message);
  }

  private _has(severity: "info" | "warn", message: unknown[]): boolean {
    return this._logs.some(
      (log) =>
        log.severity === severity &&
        JSON.stringify(log.message) === JSON.stringify(message),
    );
  }
}
