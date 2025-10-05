import React from "react";

import clsx from "clsx";
import { Row } from "@/frontend/components/core/Row";
import { Text } from "@/frontend/components/core/Text";
import { dateBoxStyles } from "@/frontend/components/calendar/utils";

export function Legend() {
  return (
    <Row className="gap-4">
      <Row className="gap-2" align="center">
        <div className={clsx("size-4", dateBoxStyles["all-day"])} />
        <Text style="small">All day</Text>
      </Row>
      <Row className="gap-2" align="center">
        <div className={clsx("size-4", dateBoxStyles["evening-only"])} />
        <Text style="small">Evening only</Text>
      </Row>
      <Row className="gap-2" align="center">
        <div className={clsx("size-4", dateBoxStyles["no-disruption"])} />
        <Text style="small">Trains</Text>
      </Row>
    </Row>
  );
}
