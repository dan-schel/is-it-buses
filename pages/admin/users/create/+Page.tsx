import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/users/create/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Input } from "@/components/core/Input";
import { Select } from "@/components/common/Select";
import { SimpleButton } from "@/components/common/SimpleButton";
import { Row } from "@/components/core/Row";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Page() {
  const data = useData<Data>();

  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState<string | null>("Username taken");
  const [loading, setLoading] = React.useState(false);

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
                  { name: "Create new user", href: "/admin/users/create" },
                ]}
              />
              <Text style="megatitle">Create new user</Text>
              <Column align="left" className="max-w-120 gap-8">
                <Column as="label" className="w-full gap-2">
                  <Text>Username</Text>
                  <Input value={username} onChange={setUsername} />
                </Column>
                <Column as="label" className="gap-2">
                  <Text>Password</Text>
                  <Text style="small">
                    [Will be randomly generated when the user is created.]
                  </Text>
                </Column>
                <Column as="label" className="w-full gap-2">
                  <Text>Permissions</Text>
                  <Select
                    options={[
                      {
                        // Should we distinguish between superadmin (created
                        // through env vars) and an admin which is allowed to
                        // manage users?
                        label: "Superadmin (allowed to manage users)",
                        value: "superadmin",
                      },
                      { label: "Admin", value: "admin" },
                      {
                        label: "General (can't do anything)",
                        value: "general",
                      },
                    ]}
                  />
                </Column>

                {error != null && (
                  <>
                    <Text style="small-red">{error}</Text>
                  </>
                )}
                <Row align="center" className="gap-2">
                  <SimpleButton text="Create" theme="primary" submit />
                  {loading && <LoadingSpinner />}
                </Row>
              </Column>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
