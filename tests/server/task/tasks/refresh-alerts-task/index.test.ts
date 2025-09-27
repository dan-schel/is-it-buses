import { ALERTS } from "@/server/database/models";
import { RefreshAlertsTask } from "@/server/task/tasks/refresh-alerts-task";
import {
  createAlert,
  createPtvAlert,
} from "@/tests/server/task/tasks/refresh-alerts-task/utils";
import { createTestApp } from "@/tests/server/utils";
import { parseIntThrow } from "@dan-schel/js-utils";
import { addDays, subDays } from "date-fns";
import { millisecondsInDay } from "date-fns/constants";
import { describe, expect, it } from "vitest";

describe("RefreshAlertsTask", () => {
  describe("#execute", () => {
    it("gracefully handles PTV fetch failures", async () => {
      const { app, alertSource, log } = createTestApp();
      alertSource.setShouldFail(true);

      const promise = new RefreshAlertsTask().execute(app);

      await expect(promise).resolves.not.toThrow();
      expect(log.hasWarn("Failed to fetch new alerts from PTV.")).toBe(true);
    });

    it("schedules alerts for deletion", async () => {
      const { app, db, time } = createTestApp();
      const alert = createAlert(db, {});
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      expect((await getAlert()).deleteAt).toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).deleteAt).toStrictEqual(addDays(time.now(), 7));
    });

    it("rescues alerts from deletion if they re-appear", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = createAlert(db, { deleteAt: addDays(time.now(), 2) });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: parseIntThrow(alert.id) });
      alertSource.setAlerts([ptvAlert]);

      expect((await getAlert()).deleteAt).not.toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).deleteAt).toBeNull();
    });

    it("deletes alerts which are due for deletion", async () => {
      const { app, db, time } = createTestApp();
      createAlert(db, { deleteAt: addDays(time.now(), 7) });
      time.advance(millisecondsInDay * 7);

      expect(await db.of(ALERTS).count()).toBe(1);
      await new RefreshAlertsTask().execute(app);
      expect(await db.of(ALERTS).count()).toBe(0);
    });

    it("contributes updated data to existing manually processed alerts", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = createAlert(db, {
        state: "processed-manually",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      const alertBefore = await getAlert();
      expect(alertBefore.state).toBe("processed-manually");
      expect(alertBefore.data.title).toBe("Outdated title");
      expect(alertBefore.updatedAt).toBeNull();
      expect(alertBefore.updatedData).toBeNull();
      expect(alertBefore.processedAt).toStrictEqual(subDays(time.now(), 2));

      await new RefreshAlertsTask().execute(app);

      const alertAfter = await getAlert();
      expect(alertAfter.state).toBe("updated-since-manual-processing");
      expect(alertAfter.data.title).toBe("Outdated title");
      expect(alertAfter.updatedAt).toStrictEqual(time.now());
      expect(alertAfter.updatedData?.title).toBe("Updated title");
      expect(alertAfter.processedAt).toStrictEqual(subDays(time.now(), 2));
    });

    it("keeps old disruptions from manually processed alerts when updated", async () => {
      expect(true).toBe(false);
    });

    it("continues to ignore alerts which were ignored permanently", async () => {
      expect(true).toBe(false);
    });

    it("re-parses updated automatically processed alerts", async () => {
      expect(true).toBe(false);
    });

    it("removes outdated disruptions when updated ones are parsed", async () => {
      expect(true).toBe(false);
    });

    it("creates alerts and disruptions for newly parsed alerts", async () => {
      expect(true).toBe(false);
    });

    it("ignores alerts automatically if auto-parsing suggests it", async () => {
      expect(true).toBe(false);
    });

    it("creates new unprocessed alerts if auto-parsing is inconclusive", async () => {
      expect(true).toBe(false);
    });
  });
});
