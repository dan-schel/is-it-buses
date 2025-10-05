import React from "react";
import { Grid } from "@/components/core/Grid";
import { PeriodFilter } from "@/pages/index/+data";
import { Row } from "@/components/core/Row";
import { Select } from "@/components/common/Select";
import { MingcuteTimeLine } from "@/components/icons/MingcuteTimeLine";
import { With } from "@/components/core/With";
import { OpenSettingsButton } from "@/components/overview/OpenSettingsButton";

type OverviewControlsProps = {
  occuring: PeriodFilter;
};

export function OverviewControls(props: OverviewControlsProps) {
  return (
    <Grid
      columns="1fr auto"
      className="bg-soft -mx-6 p-2 px-6 lg:-mx-4 lg:px-4"
    >
      <Row align="center" className="gap-2">
        <With className="text-lg">
          <MingcuteTimeLine />
        </With>
        <Select
          value={props.occuring}
          options={[
            { label: "Right now", value: "now" },
            { label: "Today", value: "today" },
            { label: "Next 7 days", value: "week" },
          ]}
          onChange={(value) => {
            window.location.search = new URLSearchParams({
              occuring: value,
            }).toString();
          }}
        />
      </Row>
      <OpenSettingsButton />
    </Grid>
  );
}
