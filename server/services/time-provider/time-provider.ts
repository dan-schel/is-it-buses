/** Manages all things related to time. Can be mocked for testing. */
export abstract class TimeProvider {
  abstract now(): Date;
  abstract setInterval(callback: () => void, ms: number): number;
  abstract clearInterval(id: number): void;
}
