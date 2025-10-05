import React from "react";

import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";
import { useSettings } from "@/frontend/components/settings/common/use-settings";
import { Spacer } from "@/frontend/components/core/Spacer";
import { SettingsSwitch } from "@/frontend/components/settings/common/SettingsSwitch";

export function SettingsAdmin() {
  const [settings, setSettings] = useSettings();

  function handleChange() {
    setSettings(settings.with({ showAdminTab: !settings.showAdminTab }));
  }

  return (
    <Column>
      <Text style="subtitle">Admin</Text>
      <Spacer h="4" />
      <SettingsSwitch
        title="Show Admin tab"
        onChange={handleChange}
        checked={settings.showAdminTab}
      />
    </Column>
  );
}
