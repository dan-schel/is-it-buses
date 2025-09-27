import { TimeProvider } from "@/server/services/time-provider/time-provider";

// TODO: Unlike FakeAlertSource and InMemoryDatabase, this is NEVER used outside
// the tests, so maybe it should go in /tests?

type Interval = {
  callback: () => void;
  ms: number;
  last: Date;
};

/** Returns a given time. Useful for unit tests. */
export class FakeTimeProvider extends TimeProvider {
  private _counter;
  private _callbacks: Map<number, Interval>;

  constructor(private _now: Date) {
    super();
    this._callbacks = new Map();
    this._counter = 0;
  }

  /** Simulates a certain number of milliseconds passing. */
  advance(ms: number): void {
    this._now = new Date(this._now.getTime() + ms);

    for (const [, interval] of this._callbacks) {
      while (interval.last.getTime() + interval.ms < this._now.getTime()) {
        interval.callback();
        interval.last = new Date(interval.last.getTime() + interval.ms);
      }
    }
  }

  now(): Date {
    return this._now;
  }

  setInterval(callback: () => void, ms: number): number {
    const id = this._counter;
    this._counter++;

    this._callbacks.set(id, { callback, ms, last: this._now });
    return id;
  }

  clearInterval(id: number): void {
    this._callbacks.delete(id);
  }
}
