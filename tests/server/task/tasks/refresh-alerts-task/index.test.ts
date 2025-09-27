import { DISRUPTIONS } from "@/server/database/models";
import {
  date2DaysAgo,
  sampleAutomaticDisruption,
  sampleManualDisruption,
  in2Days,
  in7Days,
  now,
  sampleAlert,
  samplePtvAlert,
} from "@/tests/server/task/tasks/refresh-alerts-task/utils/sample-data";
import { setupScenario } from "@/tests/server/task/tasks/refresh-alerts-task/utils/setup-scenario";
import { millisecondsInDay } from "date-fns/constants";
import { describe, expect, it } from "vitest";

describe("RefreshAlertsTask", () => {
  describe("#execute", () => {
    it("gracefully handles PTV fetch failures", async () => {
      const { runTask, log } = await setupScenario({
        ptvAlert: "fetch-error",
      });

      const promise = runTask();

      await expect(promise).resolves.not.toThrow();
      expect(log.hasWarn("Failed to fetch new alerts from PTV.")).toBe(true);
    });

    it("schedules alerts for deletion", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert,
      });

      expect((await requireAlert()).deleteAt).toBeNull();
      await runTask();
      expect((await requireAlert()).deleteAt).toStrictEqual(in7Days);
    });

    it("rescues alerts from deletion if they re-appear", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert.with({ deleteAt: in2Days }),
        ptvAlert: samplePtvAlert,
      });

      expect((await requireAlert()).deleteAt).not.toBeNull();
      await runTask();
      expect((await requireAlert()).deleteAt).toBeNull();
    });

    it("deletes alerts which are due for deletion", async () => {
      const { runTask, getAlert, time } = await setupScenario({
        existingAlert: sampleAlert.with({ deleteAt: in7Days }),
      });

      expect(await getAlert()).not.toBeNull();

      time.advance(millisecondsInDay * 7);
      await runTask();

      expect(await getAlert()).toBeNull();
    });

    it("contributes updated data to existing manually processed alerts", async () => {
      const { runTask, requireAlert, time } = await setupScenario({
        parsingRules: "passthrough-high",
        existingAlert: sampleAlert.with({ state: "processed-manually" }),
        ptvAlert: samplePtvAlert,
      });

      const before = await requireAlert();
      expect(before.state).toBe("processed-manually");
      expect(before.data.title).toBe("Outdated title");
      expect(before.updatedAt).toBeNull();
      expect(before.updatedData).toBeNull();
      expect(before.processedAt).toStrictEqual(date2DaysAgo);

      await runTask();

      const after = await requireAlert();
      expect(after.state).toBe("updated-since-manual-processing");
      expect(after.data.title).toBe("Outdated title");
      expect(after.updatedAt).toStrictEqual(time.now());
      expect(after.updatedData?.title).toBe("Updated title");
      expect(after.processedAt).toStrictEqual(date2DaysAgo);
    });

    it("keeps old disruptions from manually processed alerts when updated", async () => {
      const { runTask, getDisruption, requireAlert } = await setupScenario({
        parsingRules: "passthrough-high",
        existingAlert: sampleAlert.with({ state: "processed-manually" }),
        ptvAlert: samplePtvAlert,
        existingDisruption: sampleManualDisruption,
      });

      expect(await getDisruption()).not.toBeNull();

      await runTask();

      const alertAfter = await requireAlert();
      expect(alertAfter.state).toBe("updated-since-manual-processing");
      expect(await getDisruption()).not.toBeNull();
    });

    it("continues to ignore alerts which were ignored permanently", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert.with({ state: "ignored-permanently" }),
        ptvAlert: samplePtvAlert,
      });

      const before = await requireAlert();
      expect(before.state).toBe("ignored-permanently");
      expect(before.data.title).toBe("Outdated title");
      expect(before.updatedAt).toBeNull();
      expect(before.updatedData).toBeNull();
      expect(before.processedAt).toStrictEqual(date2DaysAgo);

      await runTask();

      const after = await requireAlert();
      expect(after.state).toBe("ignored-permanently");
      expect(after.data.title).toBe("Outdated title");
      expect(after.updatedAt).toStrictEqual(now);
      expect(after.updatedData?.title).toBe("Updated title");
      expect(after.processedAt).toStrictEqual(date2DaysAgo);
    });

    it("re-parses automatically processed alerts when updated", async () => {
      const { runTask, requireAlert, app, db } = await setupScenario({
        parsingRules: "passthrough-high",
        existingAlert: sampleAlert.with({ state: "processed-automatically" }),
        ptvAlert: samplePtvAlert,
      });

      await runTask();

      const alert = await requireAlert();
      expect(alert.state).toBe("processed-automatically");
      expect(alert.processedAt).toBe(now);

      const disruptions = await db.of(DISRUPTIONS).all();
      expect(disruptions.length).toBe(1);
      const first = disruptions[0];
      const writeup = first.data.getWriteupAuthor().write(app, first);
      expect(writeup.title).toBe("Updated title");
    });

    it("removes outdated auto-parsed disruptions when new ones are parsed", async () => {
      const { runTask, getDisruption } = await setupScenario({
        parsingRules: "passthrough-high",
        existingAlert: sampleAlert.with({ state: "processed-automatically" }),
        ptvAlert: samplePtvAlert,
        existingDisruption: sampleAutomaticDisruption,
      });

      expect(await getDisruption()).not.toBeNull();
      await runTask();
      expect(await getDisruption()).toBeNull();
    });

    it("creates alerts and disruptions for newly parsed alerts", async () => {
      const { runTask, getAlert, requireAlert, db } = await setupScenario({
        parsingRules: "passthrough-high",
        ptvAlert: samplePtvAlert,
      });

      expect(await getAlert(samplePtvAlert.id)).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await runTask();

      const after = await requireAlert(samplePtvAlert.id);
      expect(after.state).toBe("processed-automatically");
      expect(after.appearedAt).toBe(now);
      expect(after.processedAt).toBe(now);
      expect(after.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(1);
    });

    it("ignores alerts automatically if auto-parsing suggests it", async () => {
      const { runTask, getAlert, requireAlert, db } = await setupScenario({
        parsingRules: "ignore-everything",
        ptvAlert: samplePtvAlert,
      });

      expect(await getAlert(samplePtvAlert.id)).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await runTask();

      const after = await requireAlert(samplePtvAlert.id);
      expect(after.state).toBe("ignored-automatically");
      expect(after.appearedAt).toBe(now);
      expect(after.processedAt).toBe(now);
      expect(after.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);
    });

    it("creates new unprocessed alerts if auto-parsing is inconclusive", async () => {
      const { runTask, getAlert, requireAlert, db } = await setupScenario({
        ptvAlert: samplePtvAlert,
      });

      expect(await getAlert(samplePtvAlert.id)).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);

      await runTask();

      const after = await requireAlert(samplePtvAlert.id);
      expect(after.state).toBe("new");
      expect(after.appearedAt).toBe(now);
      expect(after.processedAt).toBeNull();
      expect(after.updatedData).toBeNull();
      expect(await db.of(DISRUPTIONS).count()).toBe(0);
    });

    it("unignores alerts ignored manually if updated", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert.with({ state: "ignored-manually" }),
        ptvAlert: samplePtvAlert,
      });

      const before = await requireAlert();
      expect(before.state).toBe("ignored-manually");
      expect(before.updatedData).toBeNull();

      await runTask();

      const after = await requireAlert();
      expect(after.state).toBe("updated-since-manual-processing");
      expect(after.updatedData).not.toBeNull();
    });

    it("reprocesses alerts which were ignored automatically", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert.with({ state: "ignored-automatically" }),
        ptvAlert: samplePtvAlert,
      });

      const before = await requireAlert();
      expect(before.state).toBe("ignored-automatically");
      expect(before.updatedData).toBeNull();
      await runTask();

      const after = await requireAlert();
      expect(after.state).toBe("new");
      expect(after.updatedData).toBeNull();
    });

    it("further updates already updated events", async () => {
      const { runTask, requireAlert } = await setupScenario({
        existingAlert: sampleAlert.with({
          state: "updated-since-manual-processing",
          updatedAt: date2DaysAgo,
          updatedData: sampleAlert.data.with({ title: "Slightly outdated" }),
        }),
        ptvAlert: samplePtvAlert,
      });

      const before = await requireAlert();
      expect(before.state).toBe("updated-since-manual-processing");
      expect(before.data.title).toBe("Outdated title");
      expect(before.updatedData?.title).toBe("Slightly outdated");
      expect(before.updatedAt).toBe(date2DaysAgo);

      await runTask();

      const after = await requireAlert();
      expect(after.state).toBe("updated-since-manual-processing");
      expect(after.data.title).toBe("Outdated title");
      expect(after.updatedData?.title).toBe("Updated title");
      expect(after.updatedAt).toBe(now);
    });
  });
});
