import React from "react";

import { Column } from "@/frontend/components/core/Column";
import { Spacer } from "@/frontend/components/core/Spacer";
import { PeriodFilter } from "@/frontend/pages/index/+data";
import { DisruptionSummary } from "@/shared/types/disruption";
import { SerializedMapHighlighting } from "@/shared/types/map-data";
import { Map } from "@/frontend/components/map/Map";
import { DisruptionButton } from "@/frontend/components/disruptions/DisruptionButton";
import { useSettings } from "@/frontend/components/settings/common/use-settings";
import { Geometry } from "@/frontend/components/map/renderer/geometry";
import { z } from "zod";

type MapSectionProps = {
  disruptions: DisruptionSummary[];
  mapHighlighting: SerializedMapHighlighting;
  mapGeometry: z.input<typeof Geometry.json>;
  occuring: PeriodFilter;
};

export function MapSection(props: MapSectionProps) {
  const [settings] = useSettings();

  return (
    <Column>
      <Map
        mode="show-disruptions"
        highlighting={props.mapHighlighting}
        geometry={props.mapGeometry}
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
