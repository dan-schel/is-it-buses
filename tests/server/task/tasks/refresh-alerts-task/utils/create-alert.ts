import { Alert, AlertState } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { defaultMockedNow } from "@/tests/server/utils";
import { addDays } from "date-fns";

type Options = {
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
};

export function createAlert({
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
}: Options) {
  return new Alert(
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
}
