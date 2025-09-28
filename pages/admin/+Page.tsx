import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/admin/+data";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { SimpleButton } from "@/components/common/SimpleButton";
import { useUser } from "@/components/auth/use-user";
import { reload } from "vike/client/router";

export default function Page() {
  const data = useData<Data>();

  const { logout } = useUser();

  async function handleLogout() {
    await logout();
    reload();
  }

  return (
    <PageCenterer>
      <PagePadding>
        <Column className="gap-8">
          <Text style="megatitle">Admin dashboard</Text>
          <UnwrapAuthProtectedData
            data={data}
            content={(data, user) => (
              <>
                <Column className="gap-4" align="left">
                  <Text>
                    You&apos;re logged in as <b>{user.username}</b> ({user.type}
                    ).
                  </Text>
                  <SimpleButton text="Logout" onClick={handleLogout} />
                </Column>
                <Column className="gap-4" align="left">
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
                </Column>
              </>
            )}
          />
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
