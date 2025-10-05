import React from "react";
import { Data } from "@/frontend/pages/disruption/@id/+data";
import { useData } from "vike-react/useData";

import { NotFound } from "@/frontend/components/disruptions/NotFound";
import { Disruption } from "@/frontend/pages/disruption/@id/Disruption";
import { With } from "@/frontend/components/core/With";
import { Column } from "@/frontend/components/core/Column";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { BackNavigation } from "@/frontend/components/navigation/BackNavigation";

export default function Page() {
  const { disruption, back } = useData<Data>();

  return (
    <Column>
      <BackNavigation name={back.name} href={back.href} />
      <With className="flex-1">
        <PageCenterer>
          <PagePadding>
            {disruption != null ? (
              <Disruption data={disruption} />
            ) : (
              <NotFound />
            )}
          </PagePadding>
        </PageCenterer>
      </With>
    </Column>
  );
}
