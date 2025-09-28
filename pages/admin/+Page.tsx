import React from "react";

import { Text } from "@/components/core/Text";
import { Column } from "@/components/core/Column";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { useUser } from "@/components/auth/use-user";
import { Content } from "@/pages/admin/Content";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Page() {
  const { user, login, logout } = useUser();

  return (
    <PageCenterer>
      <PagePadding>
        <Column className="gap-4">
          <Text style="megatitle">Admin</Text>
          {user != null ? (
            <Content user={user} logout={logout} />
          ) : (
            <LoginForm login={login} />
          )}
        </Column>
      </PagePadding>
    </PageCenterer>
  );
}
