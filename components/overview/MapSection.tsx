import React from "react";

import { Column } from "@/components/core/Column";
import { Spacer } from "@/components/core/Spacer";
import { PeriodFilter } from "@/pages/index/+data";
import { DisruptionSummary } from "@/shared/types/disruption";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { Map } from "@/components/map/Map";
import { DisruptionButton } from "@/components/disruptions/DisruptionButton";
import { useSettings } from "@/components/settings/common/use-settings";

type MapSectionProps = {
  disruptions: DisruptionSummary[];
  mapHighlighting: SerializedMapHighlighting;
  occuring: PeriodFilter;
};

export function MapSection(props: MapSectionProps) {
  const [settings] = useSettings();

  return (
    <Column>
      <Map
        mode="show-disruptions"
        highlighting={props.mapHighlighting}
        // Recreate the map when the theme changes, so that the colors are
        // correct.
        key={settings.theme}
      />
      <Spacer h="2" />
      <Column className="-mx-4">
        {props.disruptions.map((x) => (
          <DisruptionButton key={x.id} data={x} />
        ))}
      </Column>
    </Column>
  );
}
