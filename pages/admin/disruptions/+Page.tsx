import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/disruptions/+data";
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
                  { name: "Disruptions", href: "/admin/disruptions" },
                ]}
              />
              <Text style="megatitle">Disruptions</Text>
              <Column className="gap-8" align="left">
                {data.disruptions.map((a) => (
                  <Grid columns="auto 1fr" className="gap-2" key={a.id}>
                    <div
                      className={clsx(
                        "mt-[0.2rem] h-2 w-2 rounded-full",
                        getIconStyle(a),
                      )}
                    />
                    <Text style="small">{a.text}</Text>
                  </Grid>
                ))}
                {data.disruptions.length === 0 && <Text>No disruptions!</Text>}
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
  isInvalid,
}: {
  isActive: boolean;
  isInvalid: boolean;
}) {
  if (isInvalid) {
    return "bg-status-red";
  }
  if (isActive) {
    return "bg-accent";
  }
  return "border border-accent";
}
