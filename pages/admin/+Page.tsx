import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/admin/+data";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";

export default function Page() {
  const data = useData<Data>();

  return (
    <PageCenterer>
      <PagePadding>
        <Column className="gap-4">
          <Text style="megatitle">Admin dashboard</Text>
          <UnwrapAuthProtectedData
            data={data}
            content={(data) => (
              <>
                <Text>
                  {data.historicalAlertsCount}{" "}
                  {data.historicalAlertsCount === 1
                    ? "historical alert"
                    : "historical alerts"}{" "}
                  recorded so far.
                </Text>
                <Text>
                  That&apos;s an average of{" "}
                  {data.historicalAlertsAvgPerDay.toFixed(2)} per day.
                </Text>
              </>
            )}
          />
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
