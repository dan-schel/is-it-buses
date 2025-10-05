import React from "react";

import { format } from "date-fns";
import { Text } from "@/components/core/Text";
import { With } from "@/components/core/With";

type MonthTitleProps = {
  year: number;
  month: number;
};

export function MonthTitle({ year, month }: MonthTitleProps) {
  return (
    <With gridColumn="span 7" className="py-1">
      <Text align="center">
        {format(new Date(year, month - 1, 1), "MMMM yyyy")}
      </Text>
    </With>
  );
}
