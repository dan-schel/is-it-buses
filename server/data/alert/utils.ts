import { Alert } from "@/server/data/alert/alert";
import { AlertData } from "@/server/data/alert/alert-data";
import { TimeRange } from "@/server/data/disruption/period/utils/time-range";
import { formatRelativeDate } from "@/server/data/disruption/period/utils/utils";

export function processingPrioritySort(now: Date) {
  function assignTier(x: Alert): number {
    if (x.deleteAt != null) {
      return 4;
    } else if (x.latestData.timeRange.occursBefore(now)) {
      return 3;
    } else if (x.isInInbox) {
      return 1;
    } else {
      return 2;
    }
  }

  return (a: Alert, b: Alert): number => {
    const tierA = assignTier(a);
    const tierB = assignTier(b);
    if (tierA !== tierB) return tierA - tierB;

    if (tierA === 1 || tierA === 2) {
      const aStarts = a.latestData.startsAt ?? TimeRange.beginningOfTime;
      const bStarts = b.latestData.startsAt ?? TimeRange.beginningOfTime;
      return aStarts.getTime() - bStarts.getTime();
    } else {
      const aEnds = a.latestData.endsAt ?? TimeRange.endOfTime;
      const bEnds = b.latestData.endsAt ?? TimeRange.endOfTime;
      return bEnds.getTime() - aEnds.getTime();
    }
  };
}

export function formatAppearedAt(now: Date, appearedAt: Date): string {
  return `Appeared ${formatRelativeDate(appearedAt, now)}`;
}

export function formatActivePeriod(now: Date, data: AlertData): string {
  if (data.startsAt != null && data.startsAt > now) {
    return `Starts ${formatRelativeDate(data.startsAt, now)}`;
  } else if (data.endsAt != null && data.endsAt > now) {
    return `Ends ${formatRelativeDate(data.endsAt, now)}`;
  } else if (data.endsAt != null) {
    return `Ended ${formatRelativeDate(data.endsAt, now)}`;
  } else {
    return "Ongoing";
  }
}
