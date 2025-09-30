import { differenceInDays, format, isSameYear, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const localTimezone = "Australia/Melbourne";

/** Consider the hours of 12am-3am to belong to the previous day. */
export const dayStarts = 3;
/** Consider "evening only" to meaning the hours of 6pm-3am. */
export const eveningStarts = 18;

export function formatDate(
  date: Date,
  now: Date,
  { includeTime = true }: { includeTime?: boolean } = {},
) {
  const timeFormatCode = includeTime ? "h:mmaaa " : "";
  const yearFormatCode = isSameYear(date, now) ? "" : " yyyy";
  const localDate = toZonedTime(date, localTimezone);
  return format(localDate, `${timeFormatCode}E do MMM${yearFormatCode}`);
}

export function formatRelativeDate(date: Date, now: Date) {
  const localDate = toZonedTime(date, localTimezone);
  const localNow = toZonedTime(now, localTimezone);

  const daysDiff = differenceInDays(
    startOfDay(localDate),
    startOfDay(localNow),
  );

  if (daysDiff === 0) {
    return `today at ${format(localDate, "h:mmaaa")}`;
  } else if (daysDiff === 1) {
    return `tomorrow at ${format(localDate, "h:mmaaa")}`;
  } else if (daysDiff === -1) {
    return `yesterday at ${format(localDate, "h:mmaaa")}`;
  }

  return formatDate(date, now, { includeTime: false });
}

export function utcToLocalTime(date: Date) {
  return toZonedTime(date, localTimezone);
}

export function localToUtcTime(date: Date) {
  return fromZonedTime(date, localTimezone);
}
