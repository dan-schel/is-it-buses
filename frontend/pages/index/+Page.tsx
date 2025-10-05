import React from "react";
import { useData } from "vike-react/useData";
import { Data } from "@/frontend/pages/index/+data";

import { Column } from "@/frontend/components/core/Column";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { Hero } from "@/frontend/components/overview/Hero";
import { Divider } from "@/frontend/components/common/Divider";
import { Lines } from "@/frontend/components/overview/Lines";
import { MapSection } from "@/frontend/components/overview/MapSection";
import { FinePrint } from "@/frontend/components/overview/FinePrint";
import { OverviewControls } from "@/frontend/components/overview/OverviewControls";

export default function Page() {
  const { disruptions, suburban, regional, mapHighlighting, occuring } =
    useData<Data>();

  return (
    <PageCenterer>
      <PagePadding excludingTop={true}>
        <Column className="gap-8">
          <Hero className="mt-12 mb-4" />
          <OverviewControls occuring={occuring} />
          <MapSection
            disruptions={disruptions}
            mapHighlighting={mapHighlighting}
            occuring={occuring}
          />
          <Divider />
          <Lines suburban={suburban} regional={regional} />
          <Divider />
          <FinePrint />
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
