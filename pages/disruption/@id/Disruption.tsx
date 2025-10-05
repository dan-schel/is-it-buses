import React from "react";

import { Map } from "@/components/map/Map";
import { Text } from "@/components/core/Text";
import { Link } from "@/components/core/Link";
import { With } from "@/components/core/With";
import { Column } from "@/components/core/Column";
import { Calendar } from "@/components/calendar/Calendar";
import { CalendarData } from "@/shared/types/calendar-data";
import { SerializedMapHighlighting } from "@/shared/types/map-data";

type DisruptionProps = {
  data: {
    title: string;
    bodyMarkdown: string;
    link: string;
    calendar: CalendarData | null;
    highlighting: SerializedMapHighlighting;
  };
};

export function Disruption(props: DisruptionProps) {
  const { title, bodyMarkdown, link, calendar, highlighting } = props.data;

  return (
    <Column className="gap-8">
      <Text style="title">{title}</Text>
      <Column className="gap-4">
        {/* TODO: Parse and render markdown. */}
        {bodyMarkdown
          .split("\n")
          .map((x) => x.trim())
          .filter((x) => x.length > 0)
          .map((x, i) => (
            <Text key={i}>{x}</Text>
          ))}

        <Text>
          <Link href={link} target="_blank">
            More info ({getLinkDisplayText(link)})
          </Link>
        </Text>
      </Column>

      {calendar && <Calendar data={calendar} />}

      <With className="border-soft-border rounded-md border">
        <Map highlighting={highlighting} mode="show-disruptions" />
      </With>
    </Column>
  );
}

function getLinkDisplayText(link: string) {
  const hostName = new URL(link).hostname;

  if (hostName === "ptv.vic.gov.au" || hostName.endsWith(".ptv.vic.gov.au")) {
    return "ptv.vic.gov.au";
  }

  return hostName;
}
