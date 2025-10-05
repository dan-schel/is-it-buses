import React from "react";

import clsx from "clsx";
import { DisruptionSummary } from "@/shared/types/disruption";
import { Grid } from "@/components/core/Grid";
import { Text } from "@/components/core/Text";
import { Button } from "@/components/core/Button";
import { Column } from "@/components/core/Column";
import { MingcuteRightLine } from "@/components/icons/MingcuteRightLine";
import { MingcuteRouteFill } from "@/components/icons/MingcuteRouteFill";
import { MingcuteCloseCircleFill } from "@/components/icons/MingcuteCloseCircleFill";
import { PTVSignalMediumSpeedWarning } from "@/components/icons/PTVSignalMediumSpeedWarning";

type DisruptionButtonProps = {
  data: DisruptionSummary;
  admin?: boolean;
};

export function DisruptionButton(props: DisruptionButtonProps) {
  const { id, headline, subject, icon, valid } = props.data;

  return (
    <Button href={`/${props.admin ? "admin/disruptions" : "disruption"}/${id}`}>
      <Grid
        columns="auto 1fr auto"
        align="center"
        className="group-active:bg-soft-active group-hover:bg-soft-hover gap-2 px-4 py-2"
      >
        <DisruptionIcon icon={icon} valid={valid} />
        <Column className="gap-2">
          {headline != null && <Text style="tiny-weak">{headline}</Text>}
          <Text>{subject}</Text>
        </Column>
        <MingcuteRightLine />
      </Grid>
    </Button>
  );
}

function DisruptionIcon({
  icon,
  valid,
}: {
  icon: DisruptionSummary["icon"];
  valid?: boolean;
}) {
  const outline =
    valid !== undefined
      ? `outline-2 ${valid ? "outline-status-green" : "outline-status-red"}`
      : "";

  if (icon === "line") {
    return (
      <div
        className={clsx(
          "bg-soft flex size-6 items-center justify-center overflow-hidden rounded-full",
          outline,
        )}
      >
        <div className="bg-accent grid h-full w-1 rotate-45" />
      </div>
    );
  } else if (icon === "cross") {
    return (
      <MingcuteCloseCircleFill
        className={clsx("size-6 rounded-full", outline)}
      />
    );
  } else if (icon === "altered-route") {
    return (
      <div
        className={clsx(
          "bg-soft flex size-6 items-center justify-center rounded-full",
          outline,
        )}
      >
        <MingcuteRouteFill className="text-accent size-full p-1" />
      </div>
    );
  } else if (icon === "traffic") {
    return (
      <div
        className={clsx(
          "bg-soft flex size-6 items-center justify-center rounded-full",
          outline,
        )}
      >
        <PTVSignalMediumSpeedWarning className="size-full" />
      </div>
    );
  } else {
    // An empty circle. (TODO: Maybe we can define some default icon, idk.)
    return (
      <div
        className={clsx(
          "bg-soft flex size-6 items-center justify-center overflow-hidden rounded-full",
          outline,
        )}
      />
    );
  }
}
