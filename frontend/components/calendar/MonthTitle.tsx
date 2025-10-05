import React from "react";

import { format } from "date-fns";
import { Text } from "@/frontend/components/core/Text";
import { With } from "@/frontend/components/core/With";

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
