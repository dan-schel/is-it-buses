import React from "react";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/admin/users/+data";

import { Text } from "@/components/core/Text";
import { With } from "@/components/core/With";
import { Column } from "@/components/core/Column";
import { AdminUser } from "@/pages/admin/users/AdminUser";
import { DiscordUser } from "@/pages/admin/users/DiscordUser";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { BackNavigation } from "@/components/navigation/BackNavigation";

export default function Page() {
  const { discord, admins } = useData<Data>();

  return (
    <Column>
      <BackNavigation name="Admin" href="/admin" />
      <PageCenterer>
        <PagePadding>
          <Column className="gap-6">
            <Column className="gap-2">
              <Text style="subtitle">Administrators</Text>
              {admins.length > 0 ? (
                admins.map((user) => <AdminUser key={user.id} user={user} />)
              ) : (
                <With className="p-5">
                  <Text align="center">
                    Looks like we don&apos;t have any administrators. Maybe
                    someone from Discord can help us out.
                  </Text>
                </With>
              )}
            </Column>

            {discord.length > 0 && (
              <Column className="gap-2">
                <Text style="subtitle">Discord Members</Text>
                {discord.map((user) => (
                  <DiscordUser key={user.id} user={user} />
                ))}
              </Column>
            )}
          </Column>
        </PagePadding>
      </PageCenterer>
    </Column>
  );
}
