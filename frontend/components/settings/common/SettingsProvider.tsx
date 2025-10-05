import React, { useEffect } from "react";

import { getCookieSettings, Settings } from "@/shared/settings";
import { usePageContext } from "vike-react/usePageContext";
import Cookies from "js-cookie";
import { SettingsContext } from "@/frontend/components/settings/common/use-settings";

type SettingsProviderProps = {
  children: React.ReactNode;
};

export function SettingsProvider(props: SettingsProviderProps) {
  const { settings: settingsJson, isProduction } = usePageContext().client;

  const [settings, setSettings] = React.useState(
    Settings.json.parse(settingsJson),
  );

  useEffect(() => {
    const { sameSite, secure, maxAgeDays } = getCookieSettings(isProduction);
    const cookies = Cookies.withAttributes({
      sameSite,
      secure,
      expires: maxAgeDays,
    });

    cookies.set("settings", JSON.stringify(settings.toJSON()));
  }, [settings, isProduction]);

  return (
    <SettingsContext.Provider value={{ ready: true, settings, setSettings }}>
      {props.children}
    </SettingsContext.Provider>
  );
}
