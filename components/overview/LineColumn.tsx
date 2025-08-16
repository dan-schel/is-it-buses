import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { OverviewPageLineData } from "@/shared/types/overview-page";
import { LineButton } from "@/components/overview/LineButton";

type LinesProps = {
  title: string;
  lines: OverviewPageLineData[];
};

export function LineColumn(props: LinesProps) {
  return (
    <Column className="gap-4">
      <Text style="subtitle">{props.title}</Text>
      <Column className="-mx-4">
        {props.lines.map((line) => (
          <LineButton key={line.id} line={line} />
        ))}
      </Column>
    </Column>
  );
}
