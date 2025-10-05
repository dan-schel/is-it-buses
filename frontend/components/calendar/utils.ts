import { getDay } from "date-fns";
import { CalendarMark } from "@/shared/types/calendar-data";

export const dateBoxStyles: Record<CalendarMark, string> = {
  "no-disruption": "bg-soft",
  "evening-only": "bg-soft border-3 border-accent",
  "all-day": "bg-accent text-on-accent",
};

export function getColumn(date: { year: number; month: number; day: number }) {
  return ((getDay(new Date(date.year, date.month - 1, date.day)) + 6) % 7) + 1;
}
