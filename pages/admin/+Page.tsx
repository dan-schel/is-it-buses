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
import { MingcuteUser3Line } from "@/components/icons/MingcuteUser3Line";
import { Divider } from "@/components/common/Divider";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { MingcuteInformationLine } from "@/components/icons/MingcuteInformationLine";
import { MingcuteMailOpenLine } from "@/components/icons/MingcuteMailOpenLine";
import { MingcuteAlertOctagonLine } from "@/components/icons/MingcuteAlertOctogonLine";
import { Grid } from "@/components/core/Grid";

export default function Page() {
  const data = useData<Data>();

  const { logout } = useUser();

  async function handleLogout() {
    await logout();
    reload();
  }

  return (
    <UnwrapAuthProtectedData
      data={data}
      content={(_data, user) => (
        <PageCenterer>
          <PagePadding>
            <Column className="gap-8">
              <Breadcrumbs
                paths={[{ name: "Admin dashboard", href: "/admin" }]}
              />
              <Text style="megatitle">Admin dashboard</Text>
              <Column className="gap-4" align="left">
                <Text>
                  You&apos;re logged in as <b>{user.username}</b> ({user.type}
                  ).
                </Text>
                <SimpleButton text="Logout" onClick={handleLogout} />
              </Column>
              <Divider />
              <Column className="gap-4">
                <Text style="subtitle">Actions</Text>
                <Grid className="gap-4" columns="1fr 1fr">
                  <SimpleButton
                    href="/admin/status"
                    text="Status"
                    icon={<MingcuteInformationLine />}
                    layout="tile"
                  />
                  <SimpleButton
                    href="/admin/users"
                    text="Users"
                    icon={<MingcuteUser3Line />}
                    layout="tile"
                  />
                  <SimpleButton
                    href="/admin/alerts"
                    text="Alerts"
                    icon={<MingcuteMailOpenLine />}
                    layout="tile"
                  />
                  <SimpleButton
                    href="/admin/disruptions"
                    text="Disruptions"
                    icon={<MingcuteAlertOctagonLine />}
                    layout="tile"
                  />
                </Grid>
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
