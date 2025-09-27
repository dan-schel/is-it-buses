import { CustomDisruptionData } from "@/server/data/disruption/data/custom-disruption-data";
import { DisruptionData } from "@/server/data/disruption/data/disruption-data";
import { CurationType, Disruption } from "@/server/data/disruption/disruption";
import { DisruptionPeriod } from "@/server/data/disruption/period/disruption-period";
import { StandardDisruptionPeriod } from "@/server/data/disruption/period/standard-disruption-period";
import { defaultMockedNow } from "@/tests/server/utils";
import { uuid } from "@dan-schel/js-utils";
import { addDays } from "date-fns";

type Options = {
  id?: string;
  data?: DisruptionData;
  period?: DisruptionPeriod;
  sourceAlertId?: string | null;
  curationType?: CurationType;
};

export function createDisruption({
  id = uuid(),
  data = CustomDisruptionData.simple("Some disruption title"),
  period = StandardDisruptionPeriod.simple(
    addDays(defaultMockedNow, 2),
    addDays(defaultMockedNow, 5),
  ),
  sourceAlertId = null,
  curationType = "manual",
}: Options) {
  return new Disruption(id, data, period, sourceAlertId, curationType);
}
