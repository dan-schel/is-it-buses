import clsx from "clsx";
import React from "react";
import { LinePageActiveDisruption } from "@/shared/types/line-page";

import { Row } from "@/frontend/components/core/Row";
import { Link } from "@/frontend/components/core/Link";
import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";
import { MingcuteCloseCircleFill } from "@/frontend/components/icons/MingcuteCloseCircleFill";

type ActiveDisruptionProps = {
  lineNumber: number;
  disruption: LinePageActiveDisruption;
};

export function ActiveDisruption({
  lineNumber,
  disruption,
}: ActiveDisruptionProps) {
  return (
    <Column className="gap-3 py-2">
      <Row align="center" className={clsx("gap-2", disruption.colour)}>
        <MingcuteCloseCircleFill className="size-10" />
        <Column className="gap-1">
          {disruption.headline && (
            <Text style="custom" className="text-xl">
              {disruption.headline}
            </Text>
          )}
          <Text
            style="custom"
            className={!disruption.headline ? "text-xl" : "text-base"}
          >
            {disruption.subject}
          </Text>
        </Column>
      </Row>

      <Text>{disruption.period}</Text>
      <Link href={`/disruption/${disruption.id}?from=line-${lineNumber}`}>
        <Text>More info</Text>
      </Link>
    </Column>
  );
}
