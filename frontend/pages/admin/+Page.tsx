import React from "react";

import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { Data } from "@/frontend/pages/admin/+data";
import { UnwrapAuthProtectedData } from "@/frontend/components/auth/UnwrapAuthProtectedData";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { useUser } from "@/frontend/components/auth/use-user";
import { reload } from "vike/client/router";
import { MingcuteUser3Line } from "@/frontend/components/icons/MingcuteUser3Line";
import { Divider } from "@/frontend/components/common/Divider";
import { Breadcrumbs } from "@/frontend/components/admin/Breadcrumbs";
import { MingcuteInformationLine } from "@/frontend/components/icons/MingcuteInformationLine";
import { MingcuteMailOpenLine } from "@/frontend/components/icons/MingcuteMailOpenLine";
import { MingcuteAlertOctagonLine } from "@/frontend/components/icons/MingcuteAlertOctogonLine";
import { Grid } from "@/frontend/components/core/Grid";
import { Row } from "@/frontend/components/core/Row";

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
      content={(data, user) => (
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
                <Row align="center" className="gap-2">
                  <SimpleButton
                    text="Change password"
                    href="/admin/change-password"
                    disabled={!data.canChangePassword}
                  />
                  <SimpleButton text="Logout" onClick={handleLogout} />
                </Row>
              </Column>
              <Divider />
              <Column className="gap-4">
                <Text style="subtitle">Actions</Text>
                <Grid className="gap-2" columns="1fr 1fr">
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
