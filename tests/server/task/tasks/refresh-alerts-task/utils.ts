import { Alert, AlertState } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { ALERTS } from "@/server/database/models";
import { PtvAlert } from "@/server/services/alert-source/ptv-alert";
import { defaultMockedNow } from "@/tests/server/utils";
import { InMemoryDatabase } from "@dan-schel/db";
import { parseIntThrow } from "@dan-schel/js-utils";
import { addDays } from "date-fns";

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
}: {
  id?: number | string;
  title?: string;
  url?: string;
  description?: string;
  lastUpdated?: string;
  fromDate?: string;
  toDate?: string | null;
  routeIds?: readonly number[];
  stopIds?: readonly number[];
}): PtvAlert {
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

export function createAlert(
  db: InMemoryDatabase | null,
  {
    id = "1",
    state = "new",
    title = "Example alert title",
    description = "Example alert description",
    url = "https://example.com/alert/1",
    startsAt = addDays(defaultMockedNow, 2),
    endsAt = addDays(defaultMockedNow, 5),
    affectedLinePtvIds = [],
    affectedStationPtvIds = [],
    updatedData = null,
    appearedAt = defaultMockedNow,
    processedAt = null,
    updatedAt = null,
    deleteAt = null,
  }: {
    id?: string;
    state?: AlertState;
    title?: string;
    description?: string;
    url?: string;
    startsAt?: Date | null;
    endsAt?: Date | null;
    affectedLinePtvIds?: readonly number[];
    affectedStationPtvIds?: readonly number[];
    updatedData?: AlertData | null;
    appearedAt?: Date;
    processedAt?: Date | null;
    updatedAt?: Date | null;
    deleteAt?: Date | null;
  },
) {
  const alert = new Alert(
    id,
    state,
    new AlertData(
      title,
      description,
      url,
      startsAt,
      endsAt,
      affectedLinePtvIds,
      affectedStationPtvIds,
    ),
    updatedData,
    appearedAt,
    processedAt,
    updatedAt,
    deleteAt,
  );

  if (db != null) {
    db.of(ALERTS).create(alert);
  }

  return alert;
}
