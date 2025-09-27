import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { defaultMockedNow } from "@/tests/server/utils";
import { parseIntThrow } from "@dan-schel/js-utils";
import { addDays } from "date-fns";

type Options = {
  id?: number | string;
  title?: string;
  url?: string;
  description?: string;
  lastUpdated?: string;
  fromDate?: string;
  toDate?: string | null;
  routeIds?: readonly number[];
  stopIds?: readonly number[];
};

export function createPtvAlert({
  id = 1,
  title = "Example alert title",
  url = "https://example.com/alert/1",
  description = "Example alert description",
  lastUpdated = defaultMockedNow.toISOString(),
  fromDate = addDays(defaultMockedNow, 2).toISOString(),
  toDate = addDays(defaultMockedNow, 5).toISOString(),
  routeIds = [],
  stopIds = [],
}: Options): PtvAlert {
  return {
    id: typeof id === "number" ? id : parseIntThrow(id),
    title,
    url,
    description,
    lastUpdated,
    fromDate,
    toDate,
    routeIds,
    stopIds,
  };
}
