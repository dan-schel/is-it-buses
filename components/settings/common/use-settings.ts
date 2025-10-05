import React from "react";
import { Settings } from "@/shared/settings";

type SettingsContextContent = {
  ready: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

export const SettingsContext = React.createContext<SettingsContextContent>({
  ready: false,
  settings: Settings.default,
  setSettings() {},
});

export function useSettings() {
  const { ready, settings, setSettings } = React.useContext(SettingsContext);

  if (!ready) {
    throw new Error("Attempting to use settings outside <SettingsProvider>.");
  }

  return [settings, setSettings] as const;
}
