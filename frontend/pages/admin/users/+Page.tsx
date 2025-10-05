import React from "react";

import { Text } from "@/frontend/components/core/Text";
import { Column } from "@/frontend/components/core/Column";
import { PagePadding } from "@/frontend/components/common/PagePadding";
import { PageCenterer } from "@/frontend/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/frontend/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/frontend/pages/admin/users/+data";
import { Row } from "@/frontend/components/core/Row";
import { Breadcrumbs } from "@/frontend/components/admin/Breadcrumbs";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { MingcuteAddLine } from "@/frontend/components/icons/MingcuteAddLine";
import { Grid } from "@/frontend/components/core/Grid";
import { UserRow } from "@/frontend/components/admin/User";

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
                  { name: "Users", href: "/admin/users" },
                ]}
              />
              <Text style="megatitle">Users</Text>
              <Row align="center">
                <SimpleButton
                  href="/admin/users/create"
                  text="Create new user"
                  icon={<MingcuteAddLine />}
                  theme="primary"
                />
              </Row>
              {data.users.length !== 0 ? (
                <Grid className="gap-4" columns="1fr 1fr auto" align="center">
                  {data.users.map((u) => (
                    <UserRow user={u} key={u.id} />
                  ))}
                </Grid>
              ) : (
                <Text>No users!</Text>
              )}
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
