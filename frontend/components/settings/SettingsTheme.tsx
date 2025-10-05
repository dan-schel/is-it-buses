import React from "react";

import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";
import { Theme, themes } from "@/shared/settings";
import { applyTheme } from "@/frontend/components/settings/common/utils";
import { useSettings } from "@/frontend/components/settings/common/use-settings";
import { SettingsRadioButton } from "@/frontend/components/settings/common/SettingsRadioButton";

const formattedTheme: Record<
  (typeof themes)[number],
  { name: string; description: string | null }
> = {
  system: { name: "Auto", description: "Matches your device's settings." },
  light: { name: "Light", description: null },
  dark: { name: "Dark", description: null },
};

export function SettingsTheme() {
  const [settings, setSettings] = useSettings();

  function updateTheme(theme: Theme) {
    setSettings(settings.with({ theme }));
    applyTheme(theme);
  }

  return (
    <Column className="gap-6">
      <Text style="subtitle">Colour theme</Text>
      {themes.map((theme) => (
        <SettingsRadioButton
          key={theme}
          title={formattedTheme[theme].name}
          description={formattedTheme[theme].description ?? undefined}
          group="theme"
          checked={(settings.theme as string).includes(theme)}
          onChange={() => updateTheme(theme)}
        />
      ))}
    </Column>
  );
}
