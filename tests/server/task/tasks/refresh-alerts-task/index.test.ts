import { IgnoreEverythingParsingRule } from "@/server/data/alert/parsing/rules/ignore-everything-parsing-rule";
import { PassthroughParsingRule } from "@/server/data/alert/parsing/rules/passthrough-parsing-rule";
import { ALERTS, DISRUPTIONS } from "@/server/database/models";
import { RefreshAlertsTask } from "@/server/task/tasks/refresh-alerts-task";
import {
  createAlert,
  createDisruption,
  createPtvAlert,
} from "@/tests/server/task/tasks/refresh-alerts-task/utils";
import { createTestApp } from "@/tests/server/utils";
import { addDays, subDays } from "date-fns";
import { millisecondsInDay } from "date-fns/constants";
import { assert, describe, expect, it } from "vitest";

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
      const alert = await createAlert(db, {});
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      expect((await getAlert()).deleteAt).toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).deleteAt).toStrictEqual(addDays(time.now(), 7));
    });

    it("rescues alerts from deletion if they re-appear", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = await createAlert(db, { deleteAt: addDays(time.now(), 2) });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id });
      alertSource.setAlerts([ptvAlert]);

      expect((await getAlert()).deleteAt).not.toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).deleteAt).toBeNull();
    });

    it("deletes alerts which are due for deletion", async () => {
      const { app, db, time } = createTestApp();
      await createAlert(db, { deleteAt: addDays(time.now(), 7) });
      time.advance(millisecondsInDay * 7);

      expect(await db.of(ALERTS).count()).toBe(1);
      await new RefreshAlertsTask().execute(app);
      expect(await db.of(ALERTS).count()).toBe(0);
    });

    it("contributes updated data to existing manually processed alerts", async () => {
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new PassthroughParsingRule(app, "high")],
      });
      const alert = await createAlert(db, {
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
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new PassthroughParsingRule(app, "high")],
      });
      const alert = await createAlert(db, {
        state: "processed-manually",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      const disruption = await createDisruption(db, {
        sourceAlertId: alert.id,
      });
      const getDisruption = async () =>
        await db.of(DISRUPTIONS).get(disruption.id);

      expect(await getDisruption()).not.toBeNull();

      await new RefreshAlertsTask().execute(app);

      const alertAfter = await db.of(ALERTS).require(alert.id);
      expect(alertAfter.state).toBe("updated-since-manual-processing");
      expect(await getDisruption()).not.toBeNull();
    });

    it("continues to ignore alerts which were ignored permanently", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = await createAlert(db, {
        state: "ignored-permanently",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      const alertBefore = await getAlert();
      expect(alertBefore.state).toBe("ignored-permanently");
      expect(alertBefore.data.title).toBe("Outdated title");
      expect(alertBefore.updatedAt).toBeNull();
      expect(alertBefore.updatedData).toBeNull();
      expect(alertBefore.processedAt).toStrictEqual(subDays(time.now(), 2));

      await new RefreshAlertsTask().execute(app);

      const alertAfter = await getAlert();
      expect(alertAfter.state).toBe("ignored-permanently");
      expect(alertAfter.data.title).toBe("Outdated title");
      expect(alertAfter.updatedAt).toStrictEqual(time.now());
      expect(alertAfter.updatedData?.title).toBe("Updated title");
      expect(alertAfter.processedAt).toStrictEqual(subDays(time.now(), 2));
    });

    it("re-parses automatically processed alerts when updated", async () => {
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new PassthroughParsingRule(app, "high")],
      });
      const alert = await createAlert(db, {
        state: "processed-automatically",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).state).toBe("processed-automatically");
      expect((await getAlert()).processedAt).toBe(time.now());

      const disruptions = await db.of(DISRUPTIONS).all();
      expect(disruptions.length).toBe(1);

      const writeup = disruptions[0].data
        .getWriteupAuthor()
        .write(app, disruptions[0]);
      expect(writeup.title).toBe("Updated title");
    });

    it("removes outdated auto-parsed disruptions when new ones are parsed", async () => {
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new PassthroughParsingRule(app, "high")],
      });
      const alert = await createAlert(db, {
        state: "processed-automatically",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      const disruption = await createDisruption(db, {
        sourceAlertId: alert.id,
        curationType: "automatic",
      });
      const getDisruption = async () =>
        await db.of(DISRUPTIONS).get(disruption.id);

      expect(await getDisruption()).not.toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect(await getDisruption()).toBeNull();
    });

    it("creates alerts and disruptions for newly parsed alerts", async () => {
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new PassthroughParsingRule(app, "high")],
      });
      const alertId = "1";
      const ptvAlert = createPtvAlert({ id: alertId });
      alertSource.setAlerts([ptvAlert]);
      const getAlert = async () => await db.of(ALERTS).get(alertId);

      expect(await getAlert()).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await new RefreshAlertsTask().execute(app);

      const afterAlert = await getAlert();
      assert(afterAlert != null);
      expect(afterAlert.state).toBe("processed-automatically");
      expect(afterAlert.appearedAt).toBe(time.now());
      expect(afterAlert.processedAt).toBe(time.now());
      expect(afterAlert.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(1);
    });

    it("ignores alerts automatically if auto-parsing suggests it", async () => {
      const { app, db, time, alertSource } = createTestApp({
        alertParsingRules: (app) => [new IgnoreEverythingParsingRule(app)],
      });
      const alertId = "1";
      const ptvAlert = createPtvAlert({ id: alertId });
      alertSource.setAlerts([ptvAlert]);
      const getAlert = async () => await db.of(ALERTS).get(alertId);

      expect(await getAlert()).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await new RefreshAlertsTask().execute(app);

      const afterAlert = await getAlert();
      assert(afterAlert != null);
      expect(afterAlert.state).toBe("ignored-automatically");
      expect(afterAlert.appearedAt).toBe(time.now());
      expect(afterAlert.processedAt).toBe(time.now());
      expect(afterAlert.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);
    });

    it("creates new unprocessed alerts if auto-parsing is inconclusive", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alertId = "1";
      const ptvAlert = createPtvAlert({ id: alertId });
      alertSource.setAlerts([ptvAlert]);
      const getAlert = async () => await db.of(ALERTS).get(alertId);

      expect(await getAlert()).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await new RefreshAlertsTask().execute(app);

      const afterAlert = await getAlert();
      assert(afterAlert != null);
      expect(afterAlert.state).toBe("new");
      expect(afterAlert.appearedAt).toBe(time.now());
      expect(afterAlert.processedAt).toBeNull();
      expect(afterAlert.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);
    });

    it("unignores alerts ignored manually if updated", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = await createAlert(db, {
        state: "ignored-manually",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      expect((await getAlert()).state).toBe("ignored-manually");
      expect((await getAlert()).updatedData).toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).state).toBe("updated-since-manual-processing");
      expect((await getAlert()).updatedData).not.toBeNull();
    });

    it("reprocesses alerts which were ignored automatically", async () => {
      const { app, db, time, alertSource } = createTestApp();
      const alert = await createAlert(db, {
        state: "ignored-automatically",
        title: "Outdated title",
        processedAt: subDays(time.now(), 2),
      });
      const getAlert = async () => await db.of(ALERTS).require(alert.id);

      const ptvAlert = createPtvAlert({ id: alert.id, title: "Updated title" });
      alertSource.setAlerts([ptvAlert]);

      expect((await getAlert()).state).toBe("ignored-automatically");
      expect((await getAlert()).updatedData).toBeNull();
      await new RefreshAlertsTask().execute(app);
      expect((await getAlert()).state).toBe("new");
      expect((await getAlert()).updatedData).toBeNull();
    });
  });
});
