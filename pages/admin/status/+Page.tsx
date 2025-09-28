import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/status/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

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
                  { name: "Status", href: "/admin/status" },
                ]}
              />
              <Text style="megatitle">Status</Text>
              <Column className="gap-4" align="left">
                <Text>
                  {data.userCount} {data.userCount === 1 ? "user" : "users"}
                </Text>
                <Text>
                  {data.sessionCount}{" "}
                  {data.sessionCount === 1 ? "session" : "sessions"}
                </Text>
                <Text>
                  {data.alertCount} {data.alertCount === 1 ? "alert" : "alerts"}
                </Text>
                <Text>
                  {data.disruptionCount}{" "}
                  {data.disruptionCount === 1 ? "disruption" : "disruptions"}
                </Text>
                <Text>
                  {data.historicalAlertCount}{" "}
                  {data.historicalAlertCount === 1
                    ? "historical alert"
                    : "historical alerts"}{" "}
                  (~{data.historicalAlertAvgPerDay.toFixed(2)} per day)
                </Text>
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
