import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { CustomDisruptionData } from "@/server/data/disruption/data/custom-disruption-data";
import { Disruption } from "@/server/data/disruption/disruption";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { defaultMockedNow } from "@/tests/server/utils";
import { uuid } from "@dan-schel/js-utils";
import { addDays, subDays } from "date-fns";

export const now = defaultMockedNow;
export const in2Days = addDays(now, 2);
export const in7Days = addDays(now, 7);
export const date2DaysAgo = subDays(now, 2);

export const sampleAlert = new Alert(
  "1",
  "processed-manually",
  new AlertData(
    "Outdated title",
    "Example alert description",
    "https://example.com/alert/1",
    in2Days,
    in7Days,
    [],
    [],
  ),
  null,
  date2DaysAgo,
  date2DaysAgo,
  null,
  null,
);

export const samplePtvAlert: PtvAlert = {
  id: 1,
  title: "Updated title",
  url: "https://example.com/alert/1",
  description: "Example alert description",
  lastUpdated: now.toISOString(),
  fromDate: in2Days.toISOString(),
  toDate: in7Days.toISOString(),
  routeIds: [],
  stopIds: [],
};

export const sampleManualDisruption = new Disruption(
  uuid(),
  CustomDisruptionData.simple("Some disruption title"),
  StandardDisruptionPeriod.simple(in2Days, in7Days),
  "1",
  "manual",
);

export const sampleAutomaticDisruption = sampleManualDisruption.with({
  curationType: "automatic",
});
