import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useData } from "vike-react/useData";
import { UnwrapAuthProtectedData } from "@/components/auth/UnwrapAuthProtectedData";
import { Data } from "@/pages/admin/change-password/+data";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export default function Page() {
  const data = useData<Data>();

  return (
    <UnwrapAuthProtectedData
      data={data}
      content={(_data) => (
        <PageCenterer>
          <PagePadding>
            <Column className="gap-8">
              <Breadcrumbs
                paths={[
                  { name: "Admin dashboard", href: "/admin" },
                  { name: "Change password", href: "/admin/change-password" },
                ]}
              />
              <Text style="megatitle">Change password</Text>
            </Column>
          </PagePadding>
        </PageCenterer>
      )}
    />
  );
}
