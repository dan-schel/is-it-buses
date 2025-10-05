import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/users/+data";
import { Row } from "@/components/core/Row";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { SimpleButton } from "@/components/common/SimpleButton";
import { MingcuteAddLine } from "@/components/icons/MingcuteAddLine";
import { MingcuteDelete2Line } from "@/components/icons/MingcuteDelete2Line";
import { Grid } from "@/components/core/Grid";
import { UserRow } from "@/components/admin/User";

export default function Page() {
  const data = useData<Data>();

  return (
    <UnwrapAuthProtectedData
      data={data}
      content={(data, user) => (
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
