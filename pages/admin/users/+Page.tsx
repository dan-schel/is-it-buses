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
              <Column className="gap-4" align="left">
                {data.users.map((u) => (
                  <Row key={u.id} className="gap-4" align="center">
                    <Text>
                      <b>{u.username}</b>
                      {u.id === user.id ? " (You)" : ""}
                    </Text>
                    <Text>{u.type}</Text>
                  </Row>
                ))}
                {data.users.length === 0 && <Text>No users!</Text>}
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
