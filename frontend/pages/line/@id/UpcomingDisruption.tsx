import React from "react";
import { LinePageUpcomingDisruption } from "@/shared/types/line-page";

import { Link } from "@/frontend/components/core/Link";
import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";

type UpcomingDisruptionProps = {
  lineNumber: number;
  disruption: LinePageUpcomingDisruption;
};

export function UpcomingDisruption({
  lineNumber,
  disruption,
}: UpcomingDisruptionProps) {
  return (
    <Column className="gap-2 py-2">
      <Text>
        {disruption.headline} {disruption.subject}
      </Text>

      <Text style="small">
        {disruption.period}
        {" • "}
        <Link href={`/disruption/${disruption.id}?from=line-${lineNumber}`}>
          More info
        </Link>
      </Text>
    </Column>
  );
}
