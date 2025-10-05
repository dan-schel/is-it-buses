import React from "react";

import { LineColumn } from "@/frontend/components/overview/LineColumn";
import { OverviewPageLineData } from "@/shared/types/overview-page";

type LinesProps = {
  suburban: OverviewPageLineData[];
  regional: OverviewPageLineData[];
};

export function Lines(props: LinesProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <LineColumn title="Suburban lines" lines={props.suburban} />
      <LineColumn title="Regional lines" lines={props.regional} />
    </div>
  );
}
