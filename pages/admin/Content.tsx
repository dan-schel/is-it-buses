import React from "react";

import { Text } from "@/components/core/Text";
import { AdminButton } from "@/pages/admin/AdminButton";
import { MingcuteMailFill } from "@/components/icons/MingcuteMailFill";
import { MingcuteAlertOctagonFill } from "@/components/icons/MingcuteAlertOctagonFill";
import { MingcuteUser4Fill } from "@/components/icons/MingcuteUser4Fill";
import { LogoutFunction } from "@/components/auth/use-user";
import { UserProfile } from "@/shared/user-profile";
import { MingcuteGroup2Fill } from "@/components/icons/MingcuteGroup2Fill";
import { MingcuteExitFill } from "@/components/icons/MingcuteExitFill";

export type ContentProps = {
  user: UserProfile;
  logout: LogoutFunction;
};

export function Content({ user, logout }: ContentProps) {
  const historicalAlertsCount: number = 0;
  const historicalAlertsAvgPerDay: number = 0;

  async function handleLogout() {
    await logout();
  }

  return (
    <>
      <Text>
        {historicalAlertsCount}{" "}
        {historicalAlertsCount === 1 ? "historical alert" : "historical alerts"}{" "}
        recorded so far.
      </Text>
      <Text>
        That&apos;s an average of {historicalAlertsAvgPerDay.toFixed(2)} per
        day.
      </Text>

      <AdminButton
        action={"/admin/alerts"}
        icon={<MingcuteMailFill className="size-8" />}
        label="Alert Inbox"
      />

      <AdminButton
        action={"/admin/disruptions"}
        icon={<MingcuteAlertOctagonFill className="size-8" />}
        label="Disruptions"
      />

      <AdminButton
        action={"/admin/account"}
        icon={<MingcuteUser4Fill className="size-8" />}
        label="Account"
      />

      {user.permissions.canCreateUsers && (
        <AdminButton
          action={"/admin/users"}
          icon={<MingcuteGroup2Fill className="size-8" />}
          label="Manage Users"
        />
      )}

      <AdminButton
        action={handleLogout}
        icon={<MingcuteExitFill className="size-8" />}
        label="Logout"
      />
    </>
  );
}
