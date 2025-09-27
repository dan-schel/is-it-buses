import { TimeProvider } from "@/server/services/time-provider/time-provider";

/** Returns the real time. */
export class RealTimeProvider extends TimeProvider {
  now(): Date {
    return new Date();
  }

  setInterval(callback: () => void, ms: number): number {
    return setInterval(callback, ms)[Symbol.toPrimitive]();
  }

  clearInterval(id: number): void {
    clearInterval(id);
  }
}
