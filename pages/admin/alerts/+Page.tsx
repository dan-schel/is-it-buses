import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/alerts/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Grid } from "@/components/core/Grid";
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
                    <Text style="small">{a.title}</Text>
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
  isInInbox,
  awaitingDeletion,
}: {
  isInInbox: boolean;
  awaitingDeletion: boolean;
}) {
  if (awaitingDeletion) {
    return "bg-status-red";
  }
  if (isInInbox) {
    return "bg-accent";
  }
  return "border border-accent";
}
