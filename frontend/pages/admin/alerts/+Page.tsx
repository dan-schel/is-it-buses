import React from "react";

import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/frontend/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/frontend/pages/admin/alerts/+data";
import { Breadcrumbs } from "@/frontend/components/admin/Breadcrumbs";
import { Grid } from "@/frontend/components/core/Grid";
import clsx from "clsx";

export default function Page() {
  const data = useData<Data>();

  return (
    <UnwrapAuthProtectedData
      data={data}
      content={(data) => (
        <PageCenterer>
          <PagePadding>
            <Column className="gap-8">
              <Breadcrumbs
                paths={[
                  { name: "Admin dashboard", href: "/admin" },
                  { name: "Alerts", href: "/admin/alerts" },
                ]}
              />
              <Text style="megatitle">Alerts</Text>
              <Column className="gap-8" align="left">
                {data.alerts.map((a) => (
                  <Grid columns="auto 1fr" className="gap-2" key={a.id}>
                    <div
                      className={clsx(
                        "mt-[0.2rem] h-2 w-2 rounded-full",
                        getIconStyle(a),
                      )}
                    />
                    <Column className="gap-2">
                      <Text style="small">{a.title}</Text>
                      <Text style="tiny-weak">
                        {a.activePeriod} &bull; {a.appearedAt}
                      </Text>
                    </Column>
                  </Grid>
                ))}
                {data.alerts.length === 0 && <Text>No alerts!</Text>}
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}

function getIconStyle({
  isActive,
  isPast,
  isInInbox,
  awaitingDeletion,
}: {
  isActive: boolean;
  isPast: boolean;
  isInInbox: boolean;
  awaitingDeletion: boolean;
}) {
  if (awaitingDeletion) {
    return isActive ? "bg-status-red" : "border-[1.5px] border-status-red";
  } else if (isInInbox && !isPast) {
    return isActive ? "bg-accent" : "border-[1.5px] border-accent";
  } else {
    return isActive ? "bg-soft" : "border-[1.5px] border-soft-border";
  }
}
