import {
  AlertSource,
  Details,
} from "@/server/services/alert-source/alert-source";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";

// For testing purposes.
export class FakeAlertSource extends AlertSource {
  private _alerts: PtvAlert[] = [];

  setAlerts(alerts: PtvAlert[]) {
    this._alerts = alerts;
  }

  async fetchAlerts(): Promise<PtvAlert[]> {
    return this._alerts;
  }

  async fetchDetails(_url: string): Promise<Details> {
    return { error: "not-found" };
  }
}
