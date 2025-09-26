import { AlertData } from "@/server/data/alert/alert-data";

export const standardToAfterLastService = new AlertData(
  "Sunbury Line: Buses replace trains from 1am Saturday 10 May to last service Sunday 11 May 2025",
  "Buses replace trains between North Melbourne and Sunshine from 1am Saturday 10 May to last service Sunday 11 May, due to Metro Tunnel Project works.",
  "http://ptv.vic.gov.au/live-travel-updates/article/sunbury-line-buses-replace-trains-from-1am-saturday-10-may-to-last-service-sunday-11-may-2025",
  new Date("2025-05-09T15:00:00"),
  new Date("2025-05-11T17:00:00"),
  [14],
  [],
);

export const standardToExactly = new AlertData(
  "Werribee Line: Buses replace trains from 10:30pm Saturday 31 May to 6am Sunday 1 June 2025",
  "Buses replace trains between Newport and Werribee from 10:30pm Saturday 31 May to 6am Sunday 1 June, due to works.",
  "http://ptv.vic.gov.au/live-travel-updates/article/werribee-line-buses-replace-trains-from-1030pm-saturday-31-may-to-6am-sunday-1-june-2025",
  new Date("2025-05-31T12:30:00"),
  new Date("2025-05-31T20:00:00"),
  [16],
  [],
);

export const eveningsOnlyToAfterLastService = new AlertData(
  "Belgrave and Lilydale lines: Buses replace trains from 8:30pm to last service each night, Monday 12 May to Wednesday 14 May 2025",
  "Buses replace trains between Blackburn, Belgrave and Lilydale from 8:30pm to last service each night, Monday 12 May to Wednesday 14 May, due to maintenance works.",
  "http://ptv.vic.gov.au/live-travel-updates/article/belgrave-and-lilydale-lines-buses-replace-trains-from-8-30pm-to-last-service-each-night-monday-12-may-to-wednesday-14-may-2025",
  new Date("2025-05-12T10:30:00"),
  new Date("2025-05-14T17:00:00"),
  [2, 9],
  [],
);

export const nameCollision = new AlertData(
  "Sunbury line: Buses replace trains from 8:30pm to last service each night, Monday 12 May to Wednesday 14 May 2025",
  "Buses replace trains between West Footscray and Middle Footscray from 8:30pm to last service each night, Monday 12 May to Wednesday 14 May, due to maintenance works.",
  "http://ptv.vic.gov.au/live-travel-updates/article/belgrave-and-lilydale-lines-buses-replace-trains-from-8-30pm-to-last-service-each-night-monday-12-may-to-wednesday-14-may-2025",
  new Date("2025-05-12T10:30:00"),
  new Date("2025-05-14T17:00:00"),
  [14],
  [],
);

export const irrelevant = [
  new AlertData(
    "Delays up to 10 minutes due to an operational issue in the Malvern area.",
    "Delays up to 10 minutes due to an operational issue in the Malvern area.",
    "http://ptv.vic.gov.au/live-travel-updates/",
    new Date("2025-05-11T02:51:00"),
    null,
    [6],
    [],
  ),
  new AlertData(
    "Mordialloc Station: Temporary car park closures from Monday 3 February 2025 until further notice",
    "Sections of the station car park will be closed at times until August.",
    "http://ptv.vic.gov.au/live-travel-updates/article/mordialloc",
    new Date("2025-02-02T16:00:00"),
    null,
    [6],
    [],
  ),
  new AlertData(
    "Due to a planned network outage at Melbourne Central Station from 12:45am to 4am on Wednesday 21 May, customers travelling with existing value on their myki cards will not be impacted. Myki readers will function as normal.",
    "Due to a planned network outage at Melbourne Central Station from 12:45am to 4am on Wednesday 21 May, customers travelling with existing value on their myki cards will not be impacted. Myki readers will function as normal.",
    "http://ptv.vic.gov.au/live-travel-updates/",
    new Date("2025-05-20T14:45:00"),
    new Date("2025-05-20T18:00:00"),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17],
    [],
  ),
];
