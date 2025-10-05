import React from "react";

import { With } from "@/components/core/With";
import { Text } from "@/components/core/Text";
import { CalendarCellData } from "@/shared/types/calendar-data";
import { Column } from "@/components/core/Column";
import { dateBoxStyles, getColumn } from "@/components/calendar/utils";
import clsx from "clsx";

type CalendarCellProps = {
  data: CalendarCellData;
};

export function CalendarCell({ data }: CalendarCellProps) {
  return (
    <With gridColumn={getColumn(data)}>
      <Column
        align="center"
        justify="center"
        className={clsx("aspect-[4/3]", dateBoxStyles[data.mark])}
      >
        <Text align="center">{data.day}</Text>
      </Column>
    </With>
  );
}
