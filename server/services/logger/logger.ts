export abstract class Logger {
  abstract info(...message: unknown[]): void;
  abstract warn(...message: unknown[]): void;
}
