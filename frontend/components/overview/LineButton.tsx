import React from "react";

import clsx from "clsx";
import { Row } from "@/frontend/components/core/Row";
import { Grid } from "@/frontend/components/core/Grid";
import { Text } from "@/frontend/components/core/Text";
import { Button } from "@/frontend/components/core/Button";
import { MingcuteRightLine } from "@/frontend/components/icons/MingcuteRightLine";
import { OverviewPageLineData } from "@/shared/types/overview-page";
import { Marquee } from "@/frontend/components/common/Marquee";

type LineButtonProps = {
  line: OverviewPageLineData;
};

const bgClassMapping = {
  green: "bg-status-green",
  yellow: "bg-status-yellow",
  red: "bg-status-red",
} as const;

const textStyleMapping = {
  green: "small-green",
  yellow: "small-yellow",
  red: "small-red",
} as const;

export function LineButton({ line }: LineButtonProps) {
  return (
    <Button href={`/line/${line.id}`}>
      <Grid
        columns="auto 1fr auto auto"
        align="center"
        className="group-active:bg-soft-active group-hover:bg-soft-hover gap-2 px-4 py-2"
      >
        <Row align="center" className="gap-2">
          <div
            className={clsx(
              "size-2 rounded-full",
              bgClassMapping[line.statusColor],
            )}
          />
          <Text oneLine style="small">
            {line.name}
          </Text>
        </Row>
        <div className="border-soft-border mb-0.5 self-end border-b-2 border-dotted" />
        <Marquee>
          <Text style={textStyleMapping[line.statusColor]}>{line.status}</Text>
        </Marquee>
        <MingcuteRightLine />
      </Grid>
    </Button>
  );
}
