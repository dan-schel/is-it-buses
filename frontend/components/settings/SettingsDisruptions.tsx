import React from "react";

import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";
import { filterableDisruptionCategories } from "@/shared/settings";
import { useSettings } from "@/frontend/components/settings/common/use-settings";
import { SettingsSwitch } from "@/frontend/components/settings/common/SettingsSwitch";

const allCategories = ["essential", ...filterableDisruptionCategories] as const;

type AnyDisruptionCategory = (typeof allCategories)[number];

const formattedCategories: Record<
  AnyDisruptionCategory,
  { name: string; description?: string; disabled?: boolean }
> = {
  essential: {
    name: "Essential disruptions",
    description: "Buses replace trains, line closures",
    disabled: true,
  },
  "station-closures": {
    name: "Station closures",
  },
  cancellations: {
    name: "Cancellations",
  },
  delays: {
    name: "Delays",
  },
  "car-park-closures": {
    name: "Car park closures",
  },
  accessibility: {
    name: "Accessibility",
    description: "Lift outages, stair-only access, etc.",
  },
};

export function SettingsDisruptions() {
  const [settings, setSettings] = useSettings();

  function toggleCategory(category: AnyDisruptionCategory, newValue: boolean) {
    if (category === "essential") {
      return;
    }

    if (newValue) {
      setSettings(settings.withEnabledCategories(category));
    } else {
      setSettings(settings.withoutEnabledCategories(category));
    }
  }

  return (
    <Column className="gap-6">
      <Text style="subtitle">Disruptions to show</Text>
      {allCategories.map((category) => (
        <SettingsSwitch
          key={category}
          title={formattedCategories[category].name}
          description={formattedCategories[category].description}
          onChange={(checked) => toggleCategory(category, checked)}
          checked={
            (settings.enabledCategories as string[]).includes(category) ||
            formattedCategories[category].disabled === true
          }
          disabled={formattedCategories[category].disabled}
        />
      ))}
    </Column>
  );
}
