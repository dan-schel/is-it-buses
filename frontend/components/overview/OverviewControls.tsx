import React from "react";
import { Grid } from "@/frontend/components/core/Grid";
import { PeriodFilter } from "@/frontend/pages/index/+data";
import { Row } from "@/frontend/components/core/Row";
import { Select } from "@/frontend/components/common/Select";
import { MingcuteTimeLine } from "@/frontend/components/icons/MingcuteTimeLine";
import { With } from "@/frontend/components/core/With";
import { OpenSettingsButton } from "@/frontend/components/overview/OpenSettingsButton";

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
