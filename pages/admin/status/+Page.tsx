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
                  {data.historicalAlertCount}{" "}
                  {data.historicalAlertCount === 1
                    ? "historical alert"
                    : "historical alerts"}{" "}
                  recorded so far.
                </Text>
                <Text>
                  That&apos;s an average of{" "}
                  {data.historicalAlertAvgPerDay.toFixed(2)} per day.
                </Text>
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
