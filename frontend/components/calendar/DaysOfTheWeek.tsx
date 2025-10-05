import React from "react";

import { With } from "@/frontend/components/core/With";
import { Text } from "@/frontend/components/core/Text";

export function DaysOfTheWeek() {
  return ["M", "T", "W", "T", "F", "S", "S"].map((x, i) => (
    <With gridColumn={i + 1} key={i}>
      <Text style="small" align="center">
        {x}
      </Text>
    </With>
  ));
}
